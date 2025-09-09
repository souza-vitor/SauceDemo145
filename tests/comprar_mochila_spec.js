// 1 - Referência e bibliotecas
// Declara um objeto chamado test vindo da biblioteca Playwright
const { test, expect } = require('@playwright/test')

// 2 - CLasse ou Funções ou Métodos
test('Realizar o fluxo de compra da mochila', async ({page}) => {
    await page.goto('https://www.saucedemo.com') // abre o browser no site alvo
    await expect(page).toHaveURL('/')           // verifica se está na página raiz
    const botao_login = page.locator('#login-button')
    await expect(botao_login).toHaveText('Login') // verifica elemento escrito Login


}) // final do teste