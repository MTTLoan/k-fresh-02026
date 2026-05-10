import { test } from '@pages/base-page';
import { Constants } from '@utilities/constants';
import { generateUserProfile, generateAddress } from '@data/checkout-data';
import { Product } from '@models/product';

test.describe('E2E Tests', () => {

  test("E2E test case - Full checkout flow from registration to order placement", async ({
    commonPage,
    registerPage,
    productPage,
    cartPage,
    checkoutPage,
    assertHelper
  }) => {
    // 1. Navigate to Base URL
    await commonPage.navigate(Constants.BASE_URL);

    // 2. Go to Register page
    await commonPage.click(commonPage.roleLinkName('Register'));

    // 3. Fill registration form and submit
    const userProfile = generateUserProfile();
    await registerPage.fillRegistrationForm(userProfile);
    await registerPage.clickAgreeTermsCheckbox();
    await registerPage.submitRegistrationForm();
    await registerPage.expectSuccessfulRegistration();

    // 4. Search for a product and navigate to its detail page
    const productToSearch: Partial<Product> = { name: 'HP LP3065' };
    await productPage.searchAndSelectProduct(productToSearch as Product);

    // 5. Add product to cart
    await productPage.clickAddToCart();

    // 6. View Cart page via success alert link
    await productPage.clickViewCartLink();

    // 7. Proceed to Checkout
    await cartPage.clickCheckoutButton();

    // 8. Fill checkout details (Billing & Shipping)
    const address = generateAddress();
    // Fill billing details (Assuming new address for the registered user)
    await checkoutPage.fillBillingDetails(userProfile, address);
    await checkoutPage.clickContinueButton();

    // 9. Confirm order and finalize
    await checkoutPage.clickAgreeTermsCheckbox();
    await checkoutPage.clickPlaceOrderButton();

    // 10. Verify order success message
    await assertHelper.assertElementContainsText(commonPage.page.locator('h1'), 'Your order has been placed!');
  });
});
