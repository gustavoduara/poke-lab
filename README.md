# Poke Lab

Site de um restaurante de poke com um montador de bowl: a pessoa escolhe cada ingrediente e vê o pedido sendo montado. O objetivo é que essa montagem aconteça em **3D**.

## Situação atual

- [x] Base do projeto (React, TypeScript e Vite)
- [x] Cardápio com limite por etapa e cálculo do preço
- [x] Bowl em 3D de plástico transparente que gira (arraste para ver de outros ângulos)
- [x] Bases em 3D: arroz gohan, arroz integral e mix de folhas
- [x] Proteínas em 3D: salmão, atum, camarão e tofu
- [x] Complementos em 3D: manga, abacate, pepino, edamame, cenoura e repolho roxo
- [x] Molhos em 3D: shoyu, tarê e maionese spicy
- [x] Crocantes em 3D: gergelim, nori e couve crispy
- [x] Animação: ingredientes caindo no bowl e molho sendo despejado
- [x] Clique no pote para separar as camadas na vertical, com o nome de cada ingrediente
- [x] Giro livre com o mouse e tampa fechando o poke ao ir para o carrinho
- [x] Formas e texturas próprias, feitas por código, para salmão, atum, camarão, tofu, manga, arroz e folhas
- [ ] Modelos 3D detalhados para os demais ingredientes
- [x] Páginas do restaurante: início, cardápio, montador e sobre
- [x] Carrinho com quantidades, salvo no navegador
- [x] Finalização do pedido (simulada): entrega ou retirada, forma de pagamento e confirmação

O restaurante, o cardápio e os preços são fictícios. Nenhum pedido é enviado ou cobrado, e não há servidor: o carrinho fica salvo apenas no navegador.

## Como rodar

```bash
npm install
npm run dev
```
