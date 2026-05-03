import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    return () => accountService.refreshToken()
        .pipe(
            catchError(() => of())
        );
    }