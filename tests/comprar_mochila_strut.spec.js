import { test, expect } from '../utils/logger.js'
import { snap } from '../utils/snap.js'


async function login_step(page) {
    await page.goto('/')

    await expect(page).toHaveURL('/') // Verificação clássica
    
    // verificar o botão Login - também é clássica
    await expect(page.locator('[data-test="login-button"]')).toHaveText('Login')
}

async function success_login_fill_step(page) {
    await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_sauce')
}

async function success_login_click_step(page) {
    await page.locator('[data-test="login-button"]').click()

    await expect(page).toHaveURL(/inventory\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Products')
}

async function add_to_cart_step(page) {
    await page.locator('[data-test="shopping-cart-link"]').click()
    await expect(page).toHaveURL(/cart\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText("Your Cart")
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1')
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99')
}

async function checkout_step_one(page) {
    await page.locator('[data-test="checkout"]').click()
    await expect(page).toHaveURL(/checkout-step-one\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information')
    await page.locator('[data-test="firstName"]').fill('John')
    await page.locator('[data-test="lastName"]').fill('Tester')
    await page.locator('[data-test="postalCode"]').fill('99999000')
}

async function checkout_step_two(page) {
    await page.locator('[data-test="continue"]').click()
    await expect(page).toHaveURL(/checkout-step-two\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview')
    await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337')
    await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!')
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $29.99')
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $32.39')
}

// data-test="finish"

async function finish_order(page) {
    await page.locator('[data-test="finish"]').click()
    await expect(page).toHaveURL(/checkout-complete\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!')
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!')
    await expect(page.locator('[data-test="complete-text"]')).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')
}

test.describe('SauceDemo - fluxo principal de compra', () => {
    test('Comprar Mochila Direto', 
        async({ page }, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 15000)
        
        // inicio do passo 1
        await test.step('Acessar SauceDemo.com', async() => {
            await login_step(page, testInfo)
            await snap(page, testInfo, 'TC001-Passo01-Home')
        }) // fim do passo 1

        // inicio do passo 2
        await test.step('Login com sucesso', async () => {
            await success_login_fill_step(page, testInfo) // preenche email e senha
            await snap(page, testInfo, 'TC001-Passo02A-Home-Login-Preenchido')
            await success_login_click_step(page, testInfo) // faz o click no login
            await snap(page, testInfo, 'TC001-Passo02B-Inventory')
        }) // fim do passo 2

        // inicio do passo 3
        await test.step('Adicionar mochila no carrinho', async () => {
            const seletor_mochila = page.locator('.inventory_item').filter({ hasText: /Backpack/ })
            await seletor_mochila.getByRole('button', { name: /Add to cart/ }).click()

            await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
            await snap(page, testInfo, 'TC001-Passo03-Mochila-Adicionada')
        }) // fim do passo 3

        // inicio do passo 4
        await test.step('Ir para o carrinho', async () => {
            await add_to_cart_step(page, testInfo)
            await snap(page, testInfo, 'TC001-Passo4-Carrinho-Conferido')
        }) // fim do passo 4

        // inicio do passo 5
        await test.step('Checkout parte 1', async () => {
            await checkout_step_one(page, testInfo)
            await snap(page, testInfo, 'TC001-Passo5-Checkout-parte-um')
        }) // fim do passo 5

        // inicio do passo 6
        await test.step('Checkout parte 2', async () => {
            await checkout_step_two(page, testInfo)
            await snap(page, testInfo, 'TC001-Passo6-Checkout-parte-dois')
        }) // fim do passo 6

        // inicio do passo 7
        await test.step('Finalizar compra', async () => {
            await finish_order(page, testInfo)
            await snap(page, testInfo, 'TC001-Passo7-Finalizar-compra')
        }) // fim do passo 7

        }) // fim do teste 1
    
        // inicio do teste 2
        test('Comprar Mochila Detalhes', 
            async({ page }, testInfo) => {
            testInfo.setTimeout(testInfo.timeout + 15000)

                // inicio do passo 1
                await test.step('Acessar SauceDemo.com', async() => {
                    await login_step(page)
                    await snap(page, testInfo, 'TC002-Passo01-Home')
                }) // fim do passo 1
                
                // inicio do passo 2
                await test.step('Login com sucesso', async () => {
                    await success_login_fill_step(page) // preenche email e senha
                    await snap(page, testInfo, 'TC002-Passo02A-Home-Login-Preenchido')
                    await success_login_click_step(page) // faz o click no login
                    await snap(page, testInfo, 'TC002-Passo02B-Inventory')
                }) // fim do passo 2

                // inicio do passo 3
                await test.step('Abrir pagina da mochila e adicionar no carrinho', async () => {
                    // parte 3.1 - abrir a pagina da mochila
                    // ação
                    await page.locator('[data-test="item-4-title-link"]').click()
                    
                    // verificações
                    await expect(page).toHaveURL(/inventory-item\.html/) // url
                    await expect(page).toHaveTitle('Swag Labs') // titulo (guia)
                    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
                    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99')
                    await expect(page.locator('[data-test="back-to-products"]')).toHaveText("Back to products") // texto
                    await snap(page, testInfo, 'TC002-Passo03_1-Inventory_Item')

                    // parte 3.2 - adicionar no carrinho
                    // ação
                    await page.locator('[data-test="add-to-cart"]').click()

                    // verificações
                    await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
                    await snap(page, testInfo, 'TC002-Passo03_2-Mochila-Adicionada')
                }) // fim do passo 3

                // inicio do passo 4
                await test.step('Ir para o carrinho', async () => {
                    await add_to_cart_step(page)
                    await snap(page, testInfo, 'TC002-Passo4-Carrinho-Conferido')
                }) // fim do passo 4
                
                // inicio do passo 5
                await test.step('Checkout parte 1', async () => {
                    await checkout_step_one(page, testInfo)
                    await snap(page, testInfo, 'TC002-Passo5-Checkout-parte-um')
                }) // fim do passo 5

                // inicio do passo 6
                await test.step('Checkout parte 2', async () => {
                    await checkout_step_two(page, testInfo)
                    await snap(page, testInfo, 'TC002-Passo6-Checkout-parte-dois')
                }) // fim do passo 6

                // inicio do passo 7
                await test.step('Finalizar compra', async () => {
                    await finish_order(page, testInfo)
                    await snap(page, testInfo, 'TC002-Passo7-Finalizar-compra')
                }) // fim do passo 7

        }) // fim do teste 2
            

}) // fim do describe