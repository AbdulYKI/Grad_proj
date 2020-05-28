import { SharedService } from "../../services/shared.service";
import { AuthService } from "../../services/auth.service";
import { AlertifyService } from "../../services/alertify.service";
import { PhotoService } from "../../services/photo.service";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { environment } from "src/environments/environment";
import { Photo } from "../../models/photo";
import { LanguageEnum } from "../../helper/enums/language.enum";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

@Component({
  selector: "app-photo-uploader",
  templateUrl: "./photo-uploader.component.html",
  styleUrls: ["./photo-uploader.component.css"],
})
export class PhotoUploaderComponent implements OnInit, OnDestroy {
  constructor(
    public activeModal: NgbActiveModal,
    private photoService: PhotoService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}
  destroy: Subject<boolean> = new Subject<boolean>();
  // has to be null or I can't access it from outside
  @Input() photoUrl: string = null;
  defaultPhoto = environment.defaultPhoto;
  isUploading = false;
  allowedExtensions = ["jpg", "jpeg", "png"];
  ngOnInit(): void {}
  get faImage() {
    return faImage;
  }
  closeModal() {
    this.activeModal.dismiss("Cross click");
  }
  fileChangeEvent(event: any) {
    const newPhoto: File = event.target.files[0];

    if (this.validatePhoto(newPhoto)) {
      this.isUploading = true;
      const formData = new FormData();
      formData.append("file", newPhoto, newPhoto.name);
      this.photoService
        .uploadPhoto(this.authService.decodedToken.nameid as number, newPhoto)
        .pipe(takeUntil(this.destroy))
        .subscribe(
          (photo: Photo) => {
            this.authService.changeMemeberPhotoUrl(photo.url);
            this.photoUrl = photo.url;
            this.isUploading = false;
          },
          (error) => {
            this.alertifyService.error(error);
            this.isUploading = false;
          }
        );
    } else {
      this.isUploading = false;
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
  get lexicon() {
    return this.sharedService.lexicon;
  }
  get rtlClass() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "rtl";
    }
    return "";
  }
  get loadingSvgPath() {
    return environment.profileUploaderLoadingSvg;
  }
  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
