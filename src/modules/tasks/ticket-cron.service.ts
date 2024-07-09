import { Inject, Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { ANALYTICS_STATUS } from '../../common/enums/analytics';
import { TicketStatus } from '../../common/enums/ticket-status';
import { Analytics } from '../../entities/analytics.entity';
import { Ticket } from '../../entities/ticket.entity';
import { groupBy } from '../../utils/app.utils';
import {
  getLastMonthFirstAndLastDay,
  getMinutesBetweenDates,
} from '../../utils/date.utils';
import {
  ANALYTICS_REPOSITORY,
  TICKET_REPOSITORY,
} from '../database/database.providers';

@Injectable()
export class TicketCron {
  constructor(
    @Inject(ANALYTICS_REPOSITORY)
    private analyticsRepository: Repository<Analytics>,
    @Inject(TICKET_REPOSITORY)
    private ticketRepository: Repository<Ticket>,
  ) {}

  async getTicketCount(date: Date) {
    let complaints = {};
    const data = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.created_at >= :start AND ticket.created_at < :end', {
        start: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0,
        ),
        end: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
        ),
      })
      .select('ticket.*')
      .execute();
    const returnData = groupBy(data, (row: any) => row.branch);
    for (const key in returnData) {
      if (Object.hasOwnProperty.call(returnData, key)) {
        const array = returnData[key];
        const statusCounts = this.ticketCountByStatus(array);
        // console.log(`Status count for array ${key}:`, statusCounts);
        if (!complaints[key]) complaints[key] = {};
        complaints[key] = statusCounts;
      }
    }

    await this.updateTicketAnalyticData(complaints, date);
    // const pendingValues = this.getStatusCounts(complaints);
    // console.log('All pending values:', pendingValues);
    return complaints;
  }

  ticketCountByStatus(array: any) {
    const statusCounts = {};
    let tatTime = [];
    array.forEach((item: any) => {
      let timeInMinutes;
      let status = item.ticket_status;
      if (status == TicketStatus.COMPLETED)
        timeInMinutes = getMinutesBetweenDates(
          item.created_at,
          item.completed_at,
        );
      if (timeInMinutes) tatTime.push(timeInMinutes);
      if (status == TicketStatus.PLANNED) status = 'pending';
      if (status == TicketStatus.COMPLETED) status = 'resolved';
      if (statusCounts[status]) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }
    });
    const allTickets = array.filter((item: any) =>
      [TicketStatus.PLANNED, TicketStatus.COMPLETED].includes(
        item.ticket_status,
      ),
    )?.length;
    const average = tatTime.reduce((p, c, _, a) => p + c / a.length, 0);
    // const total = this.getStatusCounts(statusCounts)?.total;
    // const sum = tatTime.reduce((partialSum, a) => partialSum + a, 0);
    return {
      ...statusCounts,
      tatTime: average || 0,
      total: allTickets,
    };
  }

  async updateTicketAnalyticData(complaints: any, date: Date) {
    if (!complaints) return {};
    for (const key in complaints) {
      if (Object.prototype.hasOwnProperty.call(complaints, key)) {
        const element = complaints[key];
        const analytic = await this.analyticsRepository
          .createQueryBuilder('analytic')
          .where('analytic.date >= :start AND analytic.date < :end', {
            start: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              0,
              0,
              0,
            ),
            end: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              23,
              59,
              59,
            ),
          })
          .andWhere('analytic.branch.id = :id', { id: Number(key) })
          .getOne();

        if (analytic) {
          await this.analyticsRepository.update(analytic.id, {
            total_complaints: element?.total,
            resolved_complaints: element?.resolved,
            pending_complaints: element?.pending,
            complaintsTatTime: element?.tatTime,
          });
        }
      }
    }
  }

  // =====================================================================
  // month calculation

  async getTicketLastMonthCount() {
    const { firstDay, lastDay } = getLastMonthFirstAndLastDay();
    let tickets = {};
    const ticketData = await this.ticketRepository.find({
      where: {
        createdAt: Between(firstDay, lastDay),
      },
      relations: {
        branch: true,
        client: true,
      },
      select: {
        branch: {
          id: true,
          name: true,
        },
        client: {
          id: true,
          name: true,
        },
      },
    });

    const groupByBranch = groupBy(ticketData, (row: any) => row.branch.id);
    for (const branch in groupByBranch) {
      if (Object.hasOwnProperty.call(groupByBranch, branch)) {
        const branchArray = groupByBranch[branch];
        const branchDetails = this.collectBranchBasicDetails(branchArray);
        const statusCounts = this.ticketCountResultByStatus(branchArray);
        if (!tickets[branch]) tickets[branch] = {};
        tickets[branch] = { ...statusCounts, ...branchDetails };
      }
    }
    return tickets;
  }

  ticketCountResultByStatus(branch: any[]) {
    const statusCounts = {};
    let tatTime = [];
    branch.forEach((item: any) => {
      let timeInMinutes: any;
      let status = item.ticket_status;
      if (status == TicketStatus.COMPLETED)
        timeInMinutes = getMinutesBetweenDates(
          item.created_at,
          item.completed_at,
        );
      if (timeInMinutes) tatTime.push(timeInMinutes);
      if (status == TicketStatus.PLANNED) status = ANALYTICS_STATUS.PENDING;
      if (status == TicketStatus.COMPLETED) status = ANALYTICS_STATUS.RESOLVED;
      statusCounts[status]
        ? statusCounts[status]++
        : (statusCounts[status] = 1);
    });
    const allTickets = branch.filter((item: any) =>
      [TicketStatus.PLANNED, TicketStatus.COMPLETED].includes(
        item.ticket_status,
      ),
    )?.length;
    const average = tatTime.reduce((p, c, _, a) => p + c / a.length, 0);
    // const total = this.getStatusCounts(statusCounts)?.total;
    // const sum = tatTime.reduce((partialSum, a) => partialSum + a, 0);
    return {
      totalComplaints: allTickets || 0,
      resolvedComplaints: statusCounts[ANALYTICS_STATUS.RESOLVED] || 0,
      pendingComplaints: statusCounts[ANALYTICS_STATUS.PENDING] || 0,
      complaintTatTime: average || 0,
    };
  }

  collectBranchBasicDetails(branchArray: any[]) {
    const branch = branchArray?.length && branchArray[0];
    return {
      clientId: branch?.client?.id,
      branchId: branch?.branch?.id,
      cityId: branch?.city?.id,
    };
  }
}
