import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";


@Injectable({providedIn: 'root'})
export class ImageService {

  constructor(private sanitizer: DomSanitizer) {}
  defaultImagePath : any = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  loadImage(profile_image: string) {
    if (!profile_image) {
      return this.defaultImagePath;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(profile_image)
  }

}