import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { AccountService, AlertService } from './_services';

describe('AppComponent', () => {
    let accountServiceMock: any;
    let alertServiceMock: any;

    beforeEach(async () => {
        accountServiceMock = {
            account: of(null),
            logout: vi.fn(),
            refreshToken: vi.fn().mockReturnValue(of(null))
        };

        alertServiceMock = {
            onAlert: vi.fn().mockReturnValue(of({})),
            clear: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [
                AppModule,
                RouterTestingModule,
                HttpClientTestingModule
            ],
            providers: [
                { provide: AccountService, useValue: accountServiceMock },
                { provide: AlertService, useValue: alertServiceMock }
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
