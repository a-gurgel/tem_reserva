import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AccountType } from 'src/app/models/account.model';
import { Establishment } from 'src/app/models/establishment.model';
import { Reserve } from 'src/app/models/reserve.model';
import { RoutesEnum } from 'src/app/models/routes.enum';
import { SessionService } from 'src/app/shared/services/session.service';
import { ReserveUserService } from '../services/reserve-user.service';

@Component({
  selector: 'reserve-user',
  templateUrl: './reserve-user.component.html',
  styleUrls: ['./reserve-user.component.scss']
})
export class ReserveUserComponent implements OnInit {

  mesEnum = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  reserves: Reserve[];

  constructor(
    private readonly sessionService: SessionService,
    private readonly router: Router,
    private readonly reserveService: ReserveUserService,
  ) { }

  ngOnInit(): void {
    if (this.sessionService.getLoginType() === AccountType.ESTABLISHMENT) {
      this.router.navigate([RoutesEnum.RESERVE_ESTABLISHMENT]);
    }

    this.getReserves();
  }
  
  getReserves(): void {
        this.reserveService.getReservesByUserId(this.sessionService.getUserSession().id).subscribe(res => {
      this.reserves = this.orderReserve(res);
  });
  }

  orderReserve(reserve: Reserve[]) {
    return reserve.sort((a, b) => { return new Date(b.reserveDate).getTime() - new Date(a.reserveDate).getTime() });
  }

  getHour(time: string): string {
    return moment(time).format('HH:mm');
  }

  cancelReservation(reserve: Reserve): void {
    this.reserveService.cancelReservation(reserve.id).subscribe(() => this.getReserves());
  }

  transformDate(date: string): Date {
    return new Date(date);
  }
}
