import { test, expect } from '../utils/logger.js'
import { snap } from '../utils/snap.js'

test.describe('SauceDemo - fluxo principal de compra', () => {
    test('Login, Adicionar Mochila no Carrinho e Verificações', 
        async({ page }, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 15000)
        
        // inicio do passo 1
        await test.step('Acessar SauceDemo.com', async() => {
            await page.goto('/')

            await expect(page).toHaveURL('/') // Verificação clássica
            
            // verificar o botão Login - também é clássica
            await expect(page.locator('[data-test="login-button"]')).toHaveText('Login')
            await snap(page, testInfo, 'TC001-Passo01-Home')

        }) // fim do passo 1

        // inicio do passo 2
        await test.step('Login com sucesso', async () => {
            await page.locator('[data-test="username"]').fill('standard_user')
            await page.locator('[data-test="password"]').fill('secret_sauce')
            await page.locator('[data-test="login-button"]').click()

            await expect(page).toHaveURL(/inventory\.html/)
            await expect(page.locator('[data-test="title"]')).toHaveText('Products')
            await snap(page, testInfo, 'TC001-Passo02-Inventory')

        }) // fim do passo 2

        // inicio do passo 3
        await test.step('Adicionar mochila no carrinho', async () => {
            //await page.locator("#add-to-cart-sauce-labs-backpack").click()
            const seletor_mochila = page.locator('.inventory_item').filter({ hasText: /Backpack/ })
            await seletor_mochila.getByRole('button', { name: /Add to Cart/ }).click()
            
            await expect(page.locator('span.shopping_cart_badge')).toHaveText('1')
            await snap(page, testInfo, 'TC001-Passo03-Mochila-Adicionada')
            //await page.locator('span.shopping_cart_badge').click()

        }) // fim do passo 3

        }) // fim do test


}) // fim do describe