export interface JsonNfe {
  nfeProc: NfeProc;
}

export interface NfeProc {
  $: NfeProcClass;
  NFe: NFeClass;
  protNFe: ProtNFe;
}

export interface NfeProcClass {
  xmlns: string;
  versao: string;
}

export interface NFeClass {
  $: NFe;
  infNFe: InfNFeClass;
  Signature: Signature;
}

export interface NFe {
  xmlns: string;
}

export interface Signature {
  $: NFe;
  SignedInfo: SignedInfo;
  SignatureValue: string;
  KeyInfo: KeyInfo;
}

export interface KeyInfo {
  X509Data: X509Data;
}

export interface X509Data {
  X509Certificate: string;
}

export interface SignedInfo {
  CanonicalizationMethod: CanonicalizationMethodElement;
  SignatureMethod: CanonicalizationMethodElement;
  Reference: ReferenceClass;
}

export interface CanonicalizationMethodElement {
  $: CanonicalizationMethod;
}

export interface CanonicalizationMethod {
  Algorithm: string;
}

export interface ReferenceClass {
  $: Reference;
  Transforms: Transforms;
  DigestMethod: CanonicalizationMethodElement;
  DigestValue: string;
}

export interface Reference {
  URI: string;
}

export interface Transforms {
  Transform: CanonicalizationMethodElement[];
}

export interface InfNFeClass {
  $: InfNFe;
  ide: IDE;
  emit: Emit;
  dest: Dest;
  det: DetElement[];
  total: Total;
  transp: Transp;
  pag: Pag;
  infAdic: InfAdic;
}

export interface InfNFe {
  versao: string;
  Id: string;
}

export interface Dest {
  CPF: string;
  xNome: string;
  enderDest: Ender;
  indIEDest: string;
}

export interface Ender {
  xLgr: string;
  nro: string;
  xCpl?: string;
  xBairro: string;
  cMun: string;
  xMun: string;
  UF: string;
  CEP: string;
  cPais: string;
  xPais: string;
  fone?: string;
}

export interface DetElement {
  $: Det;
  prod: Prod;
  imposto: Imposto;
}

export interface Det {
  nItem: string;
}

export interface Imposto {
  vTotTrib: string;
  ICMS: Icms;
  PIS: Pis;
  COFINS: Cofins;
  ICMSUFDest: ICMSUFDest;
}

export interface Cofins {
  COFINSOutr?: COFINSAliqClass;
  COFINSAliq?: COFINSAliqClass;
}

export interface COFINSAliqClass {
  CST: string;
  vBC: string;
  pCOFINS: string;
  vCOFINS: string;
}

export interface Icms {
  ICMS00: Icms00;
}

export interface Icms00 {
  orig: string;
  CST: string;
  modBC: string;
  vBC: string;
  pICMS: string;
  vICMS: string;
}

export interface ICMSUFDest {
  vBCUFDest: string;
  vBCFCPUFDest: string;
  pFCPUFDest: string;
  pICMSUFDest: string;
  pICMSInter: string;
  pICMSInterPart: string;
  vFCPUFDest: string;
  vICMSUFDest: string;
  vICMSUFRemet: string;
}

export interface Pis {
  PISOutr?: PISAliqClass;
  PISAliq?: PISAliqClass;
}

export interface PISAliqClass {
  CST: string;
  vBC: string;
  pPIS: string;
  vPIS: string;
}

export interface Prod {
  cProd: string;
  cEAN: string;
  xProd: string;
  NCM: string;
  CEST: string;
  CFOP: string;
  uCom: string;
  qCom: string;
  vUnCom: string;
  vProd: string;
  cEANTrib: string;
  uTrib: string;
  qTrib: string;
  vUnTrib: string;
  indTot: string;
}

export interface Emit {
  CNPJ: string;
  xNome: string;
  enderEmit: Ender;
  IE: string;
  CRT: string;
}

export interface IDE {
  cUF: string;
  cNF: string;
  natOp: string;
  mod: string;
  serie: string;
  nNF: string;
  dhEmi: Date;
  dhSaiEnt: Date;
  tpNF: string;
  idDest: string;
  cMunFG: string;
  tpImp: string;
  tpEmis: string;
  cDV: string;
  tpAmb: string;
  finNFe: string;
  indFinal: string;
  indPres: string;
  indIntermed: string;
  procEmi: string;
  verProc: string;
}

export interface InfAdic {
  infCpl: string;
  obsCont: ObsContClass;
}

export interface ObsContClass {
  $: ObsCont;
  xTexto: string;
}

export interface ObsCont {
  xCampo: string;
}

export interface Pag {
  detPag: DetPag;
}

export interface DetPag {
  tPag: string;
  vPag: string;
}

export interface Total {
  ICMSTot: ICMSTot;
}

export interface ICMSTot {
  vBC: string;
  vICMS: string;
  vICMSDeson: string;
  vFCPUFDest: string;
  vICMSUFDest: string;
  vFCP: string;
  vBCST: string;
  vST: string;
  vFCPST: string;
  vFCPSTRet: string;
  vProd: string;
  vFrete: string;
  vSeg: string;
  vDesc: string;
  vII: string;
  vIPI: string;
  vIPIDevol: string;
  vPIS: string;
  vCOFINS: string;
  vOutro: string;
  vNF: string;
  vTotTrib: string;
}

export interface Transp {
  modFrete: string;
  vol: Vol;
}

export interface Vol {
  nVol: string;
  pesoL: string;
  pesoB: string;
}

export interface ProtNFe {
  $: NfeProcClass;
  infProt: InfProt;
}

export interface InfProt {
  $: NFe;
  tpAmb: string;
  verAplic: string;
  chNFe: string;
  dhRecbto: Date;
  nProt: string;
  digVal: string;
  cStat: string;
  xMotivo: string;
}
