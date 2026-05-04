import { test } from '@pages/base-page';
import { Product } from '@models/product';
import { getEnvProduct } from '@data/product.helper';
import { Assertions } from '@utilities/assertions';
import { Messages } from '@data/messages.data';

const product: Product = getEnvProduct();

test.describe('Cart API Module', () => {

  test('TC01 - Add product to cart', async ({ apiPage, assertHelper }) => {
    const response = await apiPage.apiPostRequest('index.php?route=checkout/cart/add', undefined, {
      form: {
        product_id: product.id,
        quantity: product.quantity,
      }
    });

    await assertHelper.assertResponseOK(response);
    const body = await response.json();

    Assertions.assertContains(
      body.success,
      Messages.ADD_TO_CART_SUCCESS_MESSAGE,
      `Success message should contain "${Messages.ADD_TO_CART_SUCCESS_MESSAGE}"`,
    );
  });

  test('TC02 - Update product quantity in cart', async ({ apiPage, cartPage, assertHelper }) => {
    const updatedQuantity = 3;
    await apiPage.apiPostRequest('index.php?route=checkout/cart/add', undefined, {
      form: {
        product_id: product.id,
        quantity: product.quantity,
      }
    });

    const infoResponse = await apiPage.apiGetRequest('index.php?route=common/cart/info');
    await cartPage.page.setContent(await infoResponse.text());
    const cartItemKey = await cartPage.getProductKey(product.name);

    const response = await apiPage.apiPostRequest('index.php?route=checkout/cart/edit', undefined, {
      form: {
        [`quantity[${cartItemKey}]`]: updatedQuantity,
      }
    });
    await assertHelper.assertResponseOK(response);
  });

  test('TC03 - Remove product from cart', async ({ apiPage, cartPage, assertHelper }) => {
    await apiPage.apiPostRequest('index.php?route=checkout/cart/add', undefined, {
      form: {
        product_id: product.id,
        quantity: product.quantity,
      }
    });

    const infoResponse = await apiPage.apiGetRequest('index.php?route=common/cart/info');
    await cartPage.page.setContent(await infoResponse.text());
    const cartItemKey = await cartPage.getProductKey(product.name);

    const response = await apiPage.apiPostRequest('index.php?route=checkout/cart/remove', undefined, {
      form: {
        key: cartItemKey,
      }
    });
    await assertHelper.assertResponseOK(response);

    const body = await response.json();
    Assertions.assertNotNull(body.success, 'Remove response should contain a success field');
  });
});
