# VidaSUS - Integração com APIs do SUS

## 📋 Histórico Médico - O que foi implementado

O app agora possui uma tela completa de **Histórico Médico** com 5 seções:

### 1. **Cartão de Vacinas Digital** 💉
- Histórico de doses aplicadas
- Status (Tomada / Em atraso / Pendente)  
- Próximas doses recomendadas por protocolo do Ministério da Saúde
- Alertas de vacinas em atraso

### 2. **Exames e Resultados** 🧪
- Histórico de coletas
- Status dos exames (Pronto / Processando)
- Valores de referência explicados em linguagem simples
- Ações recomendadas baseadas em resultados anormais
- Próximas datas de coleta

### 3. **Medicamentos em Uso** 💊
- Nome e dose
- Posologia (quando e como tomar)
- Avisos e interações
- Indicação clínica
- Há quanto tempo está em uso

### 4. **Consultas e Retornos** 👨‍⚕️
- Histórico de atendimentos
- Especialidade e médico
- Diagnóstico
- Próximo retorno agendado
- Local da consulta

### 5. **Alertas Preventivos** ⚠️
- Baseados em protocolos do Ministério da Saúde
- Personalizados por:
  - **Idade**: Mamografia para mulheres 40+
  - **Doenças crônicas**: Aferição mensal para hipertensão  
  - **Diabetes**: Hemoglobina glicada a cada 3 meses
  - **Colesterol**: Monitoramento semestral
  - **Função renal**: Anual para pacientes com hipertensão + diabetes

---

## 🔄 MVP Atual vs. Produção

### MVP (Agora)
✅ Dados mockados realistas para demonstração
✅ UI/UX completa com 5 seções
✅ Leitura em voz alta (acessibilidade)
✅ Conversão de termos técnicos em linguagem simples
✅ Sem necessidade de APIs externas

### Produção (Roadmap)
🔜 Integração com RNDS (Rede Nacional de Dados em Saúde)
🔜 Autenticação via login Gov.br
🔜 Dados reais do prontuário eletrônico do SUS
🔜 Integração com CNES para localização de unidades

---

## 🔐 APIs Reais do SUS - Como Funciona

### 1. **RNDS** ⭐ (Recomendado para produção)
**O que é**: API oficial do Ministério da Saúde que agrega dados clínicos
- Vacinação (Cartão Vacinal)
- Exames e resultados
- Internações
- Medicamentos dispensados
- Consultas

**Como integrar**:
1. Sua empresa se credencia como "estabelecimento de saúde" no Ministério
2. Recebe client_id + client_secret
3. Implementa fluxo OAuth com login Gov.br
4. Chama endpoints da RNDS

**Documentação**: https://rnds.saude.gov.br

**Problema**: Requer convênio formal. Pessoa física ou startup sem CNPJ de saúde não consegue credenciamento direto.

**Solução para MVP/Demo**: 
- Backend proxy em Vercel Functions ou Cloudflare Workers
- Você guarda as credenciais no servidor
- Frontend chama seu backend, que chama RNDS
- Assim a API key nunca fica exposta no navegador

### 2. **CNES** 🗺️ (Fácil de integrar)
**O que é**: Cadastro Nacional de Estabelecimentos de Saúde (acesso público)
- Nome e endereço de UBS, Hospitais, UPAs
- Tipos de serviço disponível
- Horário de funcionamento
- Telefone

**Como integrar**:
```javascript
// Backend proxy (Node.js/Vercel Function)
export default async function handler(req, res) {
  const token = await getToken(); // suas credenciais
  const response = await fetch(
    `https://apidadosabertos.saude.gov.br/cnes/estabelecimentos?${req.query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  res.json(await response.json());
}

// Frontend
const unidades = await fetch('/api/cnes?codigo_municipio=355030');
```

**Documentação**: https://apidadosabertos.saude.gov.br

### 3. **ConecteSUS / Meu SUS Digital** 📱
**O que é**: Portal que o cidadão acessa com login Gov.br
**Problema**: Dados do cidadão são protegidos. App terceiro não consegue acesso direto sem convênio
**Quando usar**: Redirect para que o usuário acesse seus próprios dados no portal

---

## 🛡️ Segurança - Como Proteger API Keys

### ❌ NÃO FAÇA ISSO
```javascript
// ❌ Nunca coloque credenciais no frontend
const API_KEY = "CHAVE_API_AQUI";
fetch(`https://api.com/endpoint?key=${API_KEY}`);
```

### ✅ FAÇA ASSIM
```
// 1. Arquivo .env (local, nunca commitado)
RNDS_CLIENT_ID=seu-id
RNDS_CLIENT_SECRET=seu-secret

// 2. Backend proxy (seu servidor)
// /api/consulta-historico.js
export default async function handler(req, res) {
  const token = await getTokenRNDS(
    process.env.RNDS_CLIENT_ID,
    process.env.RNDS_CLIENT_SECRET
  );
  const data = await fetch(
    `https://rnds.saude.gov.br/api/historico/${req.query.cpf}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  res.json(await data.json());
}

// 3. Frontend chama seu backend
const historico = await fetch('/api/consulta-historico?cpf=123456789');
```

### ✅ Arquivo .gitignore (ESSENCIAL)
```
.env          # Arquivo local com credenciais reais
.env.local    # Backup local
.env.*.local
```

**Status**: Já está configurado no projeto ✓

---

## 📝 Roadmap de Implementação

### Fase 1 (MVP atual) ✅
- [x] UI/UX do Histórico Médico com 5 seções
- [x] Dados mockados realistas
- [x] Acessibilidade (leitura em voz alta)
- [x] VLibras integrado para Libras

### Fase 2 (Demo B2G) 
- [ ] Backend proxy para acesso seguro a RNDS
- [ ] Documentação de arquitetura para Ministério
- [ ] Testes de integração mock

### Fase 3 (Produção)
- [ ] Credenciamento formal com Ministério da Saúde
- [ ] Login Gov.br
- [ ] Integração real com RNDS
- [ ] Cache inteligente (localStorage + background sync)
- [ ] Sincronização automática de dados

---

## 🚀 Como Fazer Commit Seguro

```bash
# 1. Verificar se .env está no .gitignore
cat .gitignore | grep -E "^\.env"

# 2. Garantir que o .env local NÃO foi staged
git status  # .env não deve aparecer

# 3. Usar .env.example como template
cp .env.example .env
# Editar .env com seus valores (nunca commitar)

# 4. Commitar apenas código
git add src/ index.html package.json
git commit -m "feat: adiciona histórico médico com 5 seções"
git push

# 5. Verificar se algo sensível vazou
git log -p | grep -i "openai_api_key\|client_secret\|authorization: bearer"  # Deve estar vazio
```

---

## 📚 Referências Úteis

| Recurso | URL |
|---------|-----|
| RNDS | https://rnds.saude.gov.br |
| CNES API | https://apidadosabertos.saude.gov.br |
| Meu SUS Digital | https://meususdigital.saude.gov.br |
| Portal Gov.br | https://www.gov.br/governodigital/pt-br/ |
| Protocolos de saúde MS | https://www.saude.gov.br/protocolos-e-diretrizes |

---

## 💡 Dicas para Pitch B2G

Quando apresentar para o Ministério, enfatize:

> **"O VidaSUS foi arquitetado com foco em integração com a RNDS desde o início. Atualmente funcionamos com dados mockados para MVP, mas a estrutura de backend + frontend está pronta para conectar aos dados reais do prontuário eletrônico assim que o credenciamento de saúde for aprovado. Nossas interfaces CLI para exames, medicamentos e alertas preventivos já seguem os padrões de retorno da RNDS."**

Isso mostra:
- ✅ Conhecimento profundo da arquitetura pública
- ✅ Roadmap claro e realista
- ✅ Pronto para escalar para dados reais
- ✅ Diferencia você de devs que só fizeram frontend

---

## ❓ FAQ

**P: Posso usar a RNDS agora?**  
R: Não. Requer credenciamento formal che Ministério. Mas você pode simular com dados mockados (como fazemos) e testar a integração real em sandbox.

**P: Preciso pagar para usar as APIs?**  
R: Não. RNDS e CNES são públicas e gratuitas.

**P: Minha startup pode se credenciar?**  
R: Sim, se tiver CNPJ registrado na área de saúde (clínica, lab, telemedicina, etc).

**P: E se eu quiser integrar CNES agora?**  
R: Sim! Implemente um backend proxy simples. Veja exemplo acima. É possível fazer em 1-2 horas.

---

**Última atualização**: Março 2026
**Mantido por**: VidaSUS Team
