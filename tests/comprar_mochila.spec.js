// 1 - Referência e bibliotecas
// Declara um objeto chamado test vindo da biblioteca Playwright
const { test, expect } = require('@playwright/test')

// 2 - CLasse ou Funções ou Métodos
test('Realizar o fluxo de compra da mochila', async ({page}) => {
    
    await page.goto('https://www.saucedemo.com') // abre o browser no site alvo
    await expect(page).toHaveURL('https://www.saucedemo.com') // verifica se está na página raiz
    const botaoLogin = page.locator('#login-button')
    await expect(botaoLogin).toHaveText('Login') // verifica elemento escrito Login

    // Página principal
    // Realizar o login
    // Preencher o campo cujo o localizador é name e com valor standard_user
    await page.fill('[name="user-name"]', 'standard_user')
    // Preencher o campo cujo o localizador é placeholder e com valor secret_sauce
    await page.fill('[placeholder="Password"]', 'secret_sauce')
    //clica no botão para fazer o login
    await botaoLogin.click()

    //Página Products
    //Verificar se está na página certa
    await expect(page).toHaveURL(/.*inventory/)
    await expect(page.locator('span.title')).toHaveText('Products')


    //Adicionar no carrinho
    await page.locator("#add-to-cart-sauce-labs-backpack").click()
    // xpath=/html/body/div/div/div/div[2]/div/div/div/div[1]/div[2]/div[2]/button

    // Verificar se exibe o nº1 no carrinho de compras
    const icoQuantCart = 'span.shopping_cart_badge' //cssSelector
    await expect(page.locator(icoQuantCart)).toHaveText('1') 

    //Clicar no icone do carrinho
    await page.locator(icoQuantCart).click()

    //Verificar se está no carrinho
    await expect(page).toHaveURL(/.*cart/)
    await expect(page.locator('span.title')).toHaveText('Your Cart')

    //Verificar o produto: qtd, nome e preço
    await expect(page.locator('.cart_quantity')).toHaveText('1')
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack')
    await expect(page.locator('.inventory_item_price')).toHaveText('$29.99')


    //Clicar no botão checkout
    await page.locator('#checkout').click()

    // Verificar se está na página de checkout
    await expect(page).toHaveURL(/.*checkout-step-one/)
    await expect(page.locator('span.title')).toHaveText('Checkout: Your Information')

    // Espera de 1 segundo
    await page.waitForTimeout(1000) // mal visto  -- alfinete -- 
    
    //To-do - Lista 07.
    //clicar no botão checkout - DONE
    //Preencher os campos
    //Checar pagamento, envio, imposto e pagamento total - verificar a url
    //Clicar em Finish e checar a mensagem  - verificar a url
    
    //Esse é fluxo E2E completo.

}) // final do teste