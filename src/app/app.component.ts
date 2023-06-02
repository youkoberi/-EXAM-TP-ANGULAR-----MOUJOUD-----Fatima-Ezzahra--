import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  profiles: any[] = [];
  profileForm: FormGroup;
  isEditMode = false;
  selectedProfile: any;
  


  constructor(private formBuilder: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.profileService.getProfiles().subscribe(data => {
      this.profiles = data;
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    const profile = this.profileForm.value;

    if (this.isEditMode) {
      this.profileService.updateProfile(this.selectedProfile.id, profile).subscribe(() => {
        this.resetForm();
        this.loadProfiles();
      });
    } else {
      this.profileService.createProfile(profile).subscribe(() => {
        this.resetForm();
        this.loadProfiles();
      });
    }
  }

  editProfile(profile: any) {
    this.isEditMode = true;
    this.selectedProfile = profile;
    this.profileForm.patchValue(profile);
  }

  deleteProfile(id: number) {
    this.profileService.deleteProfile(id).subscribe(() => {
      this.loadProfiles();
    });
  }

  resetForm() {
    this.profileForm.reset();
    this.isEditMode = false;
    this.selectedProfile = null;
  }
}
