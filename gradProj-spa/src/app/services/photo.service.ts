import { SharedService } from "./shared.service";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PhotoService {
  baseUrl: string = environment.apiUrl + "user/";

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  uploadPhoto(id: number, photo: File) {
    const formData = new FormData();
    formData.append("file", photo, photo.name);
    return this.http.post(
      this.baseUrl + id + "/photo/" + this.sharedService.LanguageSubject.value,
      formData
    );
  }
}
