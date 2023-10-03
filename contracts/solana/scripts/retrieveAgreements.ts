import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });

async function readAgreements() {
  try {
    // Define o URL da sua rede local Solana. Certifique-se de que a rede local esteja em execução.
    const localClusterUrl = "http://localhost:8899";
    const connection = new anchor.web3.Connection(localClusterUrl, "confirmed");

    // Configura o cliente para usar a rede local Solana.
    const provider = anchor.AnchorProvider.local(localClusterUrl);
    anchor.setProvider(provider);

    // Carrega o programa de acordos do espaço de trabalho.
    const program = anchor.workspace.AgreementProgram;

    // Obtenha a chave pública da empresa a partir da carteira do provedor.
    const companyAddress = provider.wallet.publicKey;

    // Converte a string "company_agreements" em um buffer para ser usado em cálculos de PDA.
    const stringBuffer = Buffer.from("company_agreements", "utf-8");

    // Encontre o Program Derived Address (PDA) para os acordos da empresa usando o buffer e o endereço da empresa.
    const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBuffer, companyAddress.toBuffer()],
      program.programId
    );

    // Consulta os detalhes dos acordos associados à empresa a partir da blockchain.
    const fetchedCompanyAgreements = await program.account.companyAgreements.fetch(
      companyAgreementsPublicKey
    );

    console.log("fetchedCompanyAgreements", fetchedCompanyAgreements)

    // // Processa e exibe os acordos associados à empresa.
    // for (const agreement of fetchedCompanyAgreements.agreements) {
    //   console.log("Título do Acordo:", agreement.title);
    //   console.log("Descrição do Acordo:", agreement.description);
    //   console.log("Profissional:", agreement.professional.toBase58());
    //   console.log("Empresa:", agreement.company.toBase58());
    //   console.log("Status:", agreement.status);
    //   console.log("------");
    // }
  } catch (error) {
    console.error("Erro ao ler os acordos:", error);
  }
}

// Chame a função para ler os acordos.
readAgreements();
