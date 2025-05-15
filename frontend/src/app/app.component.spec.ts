import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { CandidateService } from '../app/services/candidate.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        ReactiveFormsModule,
        MatTableModule,
        HttpClientTestingModule,
      ],
      providers: [CandidateService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); //verify that the component is created successfully
  });

  it(`should have the 'candidate-loader' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('candidate-loader'); //verify that the title is correct
  });

  it('should initialize the form with empty values', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.candidateForm.value).toEqual({
      name: '',
      surname: '',
      file: null,
    }); //verify that the form is initialized with empty values
  });

  it('should add a candidate to the list', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    //mock the MatTable reference to avoid errors when calling renderRows
    app.table = {
      renderRows: jasmine.createSpy('renderRows'),
    } as any;

    //mock the service response when uploading candidate data
    spyOn(app['candidateService'], 'uploadCandidateData').and.returnValue(
      of([
        {
          name: 'Juani',
          surname: 'Morillo',
          seniority: 'Junior',
          years: 1,
          availability: true,
        },
      ])
    );

    //set form values
    app.candidateForm.setValue({
      name: 'Juani',
      surname: 'Morillo',
      file: new File([''], 'test.xlsx'),
    });

    app.onSubmit(); 

    //verify that the candidate is added correctly
    expect(app.candidates.length).toBe(1);
    expect(app.candidates[0].name).toBe('Juani');
    expect(app.candidates[0].surname).toBe('Morillo');
    expect(app.table.renderRows).toHaveBeenCalled();
  });

  it('should remove a candidate from the list', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    //mock the MatTable reference to avoid errors when calling renderRows
    app.table = {
      renderRows: jasmine.createSpy('renderRows'),
    } as any;

    //initialize the candidate list with one candidate
    app.candidates = [
      {
        name: 'Juani',
        surname: 'Morillo',
        seniority: 'Junior',
        years: 1,
        availability: true,
      },
    ];

    app.removeCandidate(0); 

    //verify that the candidate is removed correctly
    expect(app.candidates.length).toBe(0);
    expect(app.table.renderRows).toHaveBeenCalled(); 
  });
});
