import { SharedService } from "./../services/shared.service";
import { AuthService } from "./../services/auth.service";
import { AlertifyService } from "./../services/alertify.service";
import { PhotoService } from "./../services/photo.service";
import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { environment } from "src/environments/environment";
import { Photo } from "../models/photo";
import { LanguageEnum } from "../helper/language.enum";

@Component({
  selector: "app-photo-uploader",
  templateUrl: "./photo-uploader.component.html",
  styleUrls: ["./photo-uploader.component.css"],
})
export class PhotoUploaderComponent implements OnInit {
  constructor(
    public activeModal: NgbActiveModal,
    private photoService: PhotoService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}
  // has to be null or I can't access it from outside
  photoUrl: string = null;
  defaultPhoto = environment.defaultPhoto;
  uploadingFlag = false;
  allowedExtensions = ["jpg", "jpeg", "png"];
  ngOnInit(): void {}
  get FaImage() {
    return faImage;
  }
  closeModal() {
    this.activeModal.dismiss("Cross click");
  }
  fileChangeEvent(event: any) {
    const newPhoto: File = event.target.files[0];
    this.uploadingFlag = true;

    if (this.validatePhoto(newPhoto)) {
      const formData = new FormData();
      formData.append("file", newPhoto, newPhoto.name);
      this.photoService
        .uploadPhoto(this.authService.decodedToken.nameid as number, newPhoto)
        .subscribe(
          (photo: Photo) => {
            this.authService.changeMemeberPhotoUrl(photo.url);
            this.photoUrl = photo.url;
            this.uploadingFlag = false;
          },
          (error) => {
            this.alertifyService.error(error);
            this.uploadingFlag = false;
          }
        );
    } else {
      this.uploadingFlag = false;
    }
  }
  validatePhoto(photo: File): boolean {
    return (
      this.fileExtensions(photo.name) &&
      this.fileMaxSize(4000000, photo) &&
      this.fileMinSize(20, photo)
    );
  }
  getExtension(filename: string): null | string {
    if (filename.indexOf(".") === -1) {
      return null;
    }
    return filename.split(".").pop();
  }

  fileExtensions(fileName: string): boolean {
    const ext = this.getExtension(fileName).toLowerCase();

    if (this.allowedExtensions.indexOf(ext) === -1) {
      this.alertifyService.error("extension error");
      return false;
    }
    return true;
  }

  fileMaxSize(maxSize: number, file: File): boolean {
    if (file instanceof File && file.size > maxSize) {
      this.alertifyService.error("photo over size");
      return false;
    }
    return true;
  }

  fileMinSize(minSize: number, file: File): boolean {
    if (file instanceof File && file.size < minSize) {
      this.alertifyService.error("photo below size");
      return false;
    }
    return true;
  }
  get Lexicon() {
    return this.sharedService.Lexicon;
  }
  get RtlClass() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "rtl";
    }
    return "";
  }
}