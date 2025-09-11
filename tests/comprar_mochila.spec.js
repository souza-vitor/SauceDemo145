// 1 - Referência e bibliotecas
// Declara um objeto chamado test vindo da biblioteca Playwright
const { test, expect } = require('@playwright/test')

// 2 - CLasse ou Funções ou Métodos
test('Realizar o fluxo de compra da mochila', async ({page}) => {
    
    await page.goto('https://www.saucedemo.com') // abre o browser no site alvo
    await expect(page).toHaveURL('https://www.saucedemo.com') // verifica se está na página raiz
    const botao_login = page.locator('#login-button')
    await expect(botao_login).toHaveText('Login') // verifica elemento escrito Login

    // Página principal
    // Realizar o login
    // Preencher o campo cujo o localizador é name e com valor standard_user
    await page.fill('[name="user-name"]', 'standard_user')
    // Preencher o campo cujo o localizador é placeholder e com valor secret_sauce
    await page.fill('[placeholder="Password"]', 'secret_sauce')
    //clica no botão para fazer o login
    await botao_login.click()

    //Página Products
    //Verificar se está na página certa
    await expect(page).toHaveURL(/.*inventory/)
    await expect(page.locator('span.title')).toHaveText('Products')


    //Adicionar no carrinho
    await page.locator("#item_4_img_link > img:nth-child(1)").click()

}) // final do teste