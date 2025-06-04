# Bot Cripto Binance

Este projeto é um bot simples para negociação automatizada de criptomoedas na Binance, utilizando médias móveis simples (SMA) como estratégia de compra e venda.

## Funcionalidades

- Consulta dados de candles da Binance (testnet)
- Calcula médias móveis (SMA13 e SMA21)
- Realiza ordens de compra e venda automaticamente com base nas médias móveis
- Utiliza variáveis de ambiente para configuração de chaves e parâmetros

## Pré-requisitos

- Node.js instalado
- Conta na Binance (para obter API Key e Secret)
- Chaves de API configuradas na testnet da Binance

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/bot-cripto.git
   cd bot-cripto
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure o arquivo `.env` com suas chaves e parâmetros (veja `env.example` como referência).

## Uso

Execute o bot com:

```sh
node index.js
```

O bot irá buscar os dados de candles, calcular as médias móveis e executar ordens de compra/venda automaticamente na testnet da Binance.

## Configuração

As variáveis de ambiente necessárias estão no arquivo `.env`:

- `API_KEY` e `SECRET_KEY`: Chaves da API da Binance (testnet)
- `QUANTITY`: Quantidade de cripto para negociar
- `SYMBOL`: Par de negociação (ex: BTCUSDT)
- `API_URL_TEST`: URL da API testnet da Binance
- `API_URL_PROD`: URL da API principal da Binance

Veja o arquivo [`env.example`](env.example) para um exemplo de configuração.

## Aviso

> **Atenção:** Este bot está configurado para operar na testnet da Binance. Use com responsabilidade e nunca coloque suas chaves reais em produção sem entender os riscos.

## Licença

ISC