import { MessageListPaginationParams } from "src/app/helper/pagination/message-list-pagination-params";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs/internal/Observable";
import { PaginationResult } from "../helper/pagination/pagination-result";
import { map } from "rxjs/operators";
import { Message } from "../models/message";
import { PropertyNameFinder as PropertyNameToStringConverter } from "./../helper/property-name-to-string";
@Injectable({
  providedIn: "root",
})
export class MessageService {
  baseUrl: string = environment.apiUrl + "user/";
  constructor(private http: HttpClient) {}
  getMessagesThread(id: number, recipienetId: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      this.baseUrl + id + "/message/thread/" + recipienetId
    );
  }
  getMessagesForList(
    userId: number,
    pageSize: number,
    pageNumber: number,
    messageParams: MessageListPaginationParams
  ): Observable<PaginationResult<Message[]>> {
    const paginationResult = new PaginationResult<Message[]>();
    let httpParams = new HttpParams();
    if (messageParams?.messageContainer != null) {
      httpParams = httpParams.append(
        PropertyNameToStringConverter.propertyNameToString(
          messageParams,
          messageParams.messageContainer
        ),
        messageParams.messageContainer.toString()
      );
    }

    if (pageSize != null && pageNumber != null) {
      httpParams = httpParams.append("pageSize", pageSize.toString());
      httpParams = httpParams.append("pageNumber", pageNumber.toString());
    }
    return this.http
      .get(this.baseUrl + userId + "/message", {
        observe: "response",
        params: httpParams,
      })
      .pipe(
        map((response) => {
          paginationResult.result = response.body as Message[];
          if (response.headers.get("Pagination") != null) {
            paginationResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }
          return paginationResult;
        })
      );
  }
  deleteMessage(messageId: number, userId: number) {
    return this.http.delete(this.baseUrl + userId + "/message/" + messageId);
  }
}
