import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoadingCompComponent } from "./loading-comp.component";

describe("LoadingCompComponent", () => {
  let component: LoadingCompComponent;
  let fixture: ComponentFixture<LoadingCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingCompComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
