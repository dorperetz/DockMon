import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {ConfigService} from '../config/config.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../interfaces/state/app-state';
import {UpdateHostsAction} from '../../reducers/actions';
import {HostData} from '../../interfaces/host/host-data';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ContainersStatsService {
  private serverUrl;

  constructor(private configService: ConfigService,
              private http: HttpClient,
              private store: Store<AppState>) {
    this.serverUrl = `${configService.getConfig().host}/stats/getDataFromAllHosts`;
    this.fetchData().subscribe((hostsData) => {
      this.updateHosts(hostsData);
      Observable.interval(6000).switchMap(() => {
        return this.fetchData();
      }).subscribe(this.updateHosts.bind(this));
    })
  }

  updateHosts(hostsData: HostData[]): void {
    this.store.dispatch(new UpdateHostsAction(hostsData));
  }

  fetchData(): Observable<HostData[]> {
    return this.http.get<HostData[]>(this.serverUrl);
  }

  refreshHosts(): void {
    this.fetchData().subscribe((hostsData) => this.updateHosts(hostsData));
  }
}

