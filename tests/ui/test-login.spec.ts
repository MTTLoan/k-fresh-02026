import { test } from '@pages/base-page';
import { Constants } from '@utilities/constants';
import { user } from '@data/login.data';

test.describe('Login Tests', () => {

  test.beforeEach(async ({ commonPage }) => {
    await commonPage.goto(Constants.LOGIN_URL);
  });

});
