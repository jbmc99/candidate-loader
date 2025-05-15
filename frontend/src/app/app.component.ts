import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { CandidateService } from '../app/services/candidate.service';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatGridListModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MatTable) table!: MatTable<any>;

  title = 'candidate-loader';
  candidateForm!: FormGroup;
  candidates: any[] = [];

  displayedColumns: string[] = [
    'name',
    'surname',
    'seniority',
    'years',
    'availability',
    'actions',
  ];

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService
  ) {
    this.initializeForm();
    this.loadStoredCandidates(); //load candidates from localStorage on init
  }

  private initializeForm(): void {
    //initialize reactive form with validation
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      file: [null, Validators.required],
    });
  }

  private loadStoredCandidates(): void {
    const stored = localStorage.getItem('candidates');
    if (stored) {
      this.candidates = JSON.parse(stored);
    }
  }

  onFileChange(event: Event): void {
    //handle file input and patch form control
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.candidateForm.patchValue({ file });
    }
  }

  onSubmit(): void {
    if (this.candidateForm.invalid) return;

    this.isSubmitting = true;
    const formData = this.createFormData();

    //send form data to backend via service
    this.candidateService.uploadCandidateData(formData).subscribe({
      next: (response) => this.handleSuccess(response),
      error: (err) => this.handleError(err),
    });
  }

  private createFormData(): FormData {
    //prepare multipart/form-data payload for backend
    const formData = new FormData();
    formData.append('name', this.candidateForm.get('name')?.value);
    formData.append('surname', this.candidateForm.get('surname')?.value);
    formData.append('file', this.candidateForm.get('file')?.value);
    return formData;
  }

  private handleSuccess(response: any): void {
    //append new candidate(s) to list and persist them
    this.candidates = [...this.candidates, ...response];
    localStorage.setItem('candidates', JSON.stringify(this.candidates));
    this.resetForm();
    this.isSubmitting = false;
    this.table.renderRows(); //refresh table view
  }

  private handleError(err: any): void {
    console.error('Error uploading candidate data:', err);
    this.isSubmitting = false;
  }

  private resetForm(): void {
    //reset form fields and validation state
    this.candidateForm.reset();
    Object.keys(this.candidateForm.controls).forEach((key) => {
      const control = this.candidateForm.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });

    //clear file input manually
    const fileInput = document.getElementById('excelFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  removeCandidate(index: number): void {
    //remove candidate by index and update storage
    this.candidates.splice(index, 1);
    this.updateLocalStorage();
    this.table.renderRows();
  }

  private updateLocalStorage(): void {
    localStorage.setItem('candidates', JSON.stringify(this.candidates));
  }
}
