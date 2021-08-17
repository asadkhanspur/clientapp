import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification, RefreshData } from '../modals';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private refreshData$: Subject<RefreshData>;
  private notification$: Subject<Notification>;
  private connection: signalR.HubConnection;

  constructor() {
    this.notification$ = new Subject<Notification>();
    this.refreshData$ = new Subject<RefreshData>();
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl)
      .build();

    this.connection.serverTimeoutInMilliseconds = 100000; // 100 seconds

    this.connect();
  }

  private connect() {
    // this.connection.start().catch(err => console.log(err));

    this.connection.start()
      .then(() => console.info('Websocket Connection Established'))
      .catch(err => console.error('SignalR Connection Error: ', err));


    this.connection.on('RefreshData', (refreshData) => {
      this.refreshData$.next(refreshData);
    });

    this.connection.on('Notification', (notification) => {
      this.notification$.next(notification);
    });
  }

  public getRefreshData(): Observable<RefreshData> {
    return this.refreshData$;
  }

  public getNotification(): Observable<Notification> {
    return this.notification$;
  }

  public disconnect() {
    this.connection.stop();
  }
}