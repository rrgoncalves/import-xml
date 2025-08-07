class FormHandler {
  dirBtn: HTMLButtonElement;

  dirInput: HTMLInputElement;

  docInput: HTMLInputElement;

  docError: HTMLSpanElement;

  saveBtn: HTMLButtonElement;

  cancelBtn: HTMLButtonElement;

  validateDocBtn: HTMLButtonElement;

  constructor() {
    this.dirBtn = document.getElementById('dir-btn') as HTMLButtonElement;
    this.dirInput = document.getElementById('directory') as HTMLInputElement;
    this.docInput = document.getElementById('document') as HTMLInputElement;
    this.docError = document.getElementById('documentError') as HTMLSpanElement;
    this.saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
    this.cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;
    this.validateDocBtn = document.getElementById(
      'validate-doc-btn',
    ) as HTMLButtonElement;
    this.initEvents();
  }

  private validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = soma % 11;
    const digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = soma % 11;
    const digito2 = resto < 2 ? 0 : 11 - resto;
    return digito2 === parseInt(cpf.charAt(10));
  }

  private validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  }

  private initEvents() {
    this.dirBtn.onclick = async () => {
      const dir: string = await window[String('electronAPI')].selectDirectory();
      if (dir) this.dirInput.value = dir;
    };

    this.docInput.addEventListener('input', () => {
      const doc = this.docInput.value.replace(/\D/g, '');
      if (doc.length === 11) {
        this.docError.textContent = this.validarCPF(doc) ? '' : 'CPF inválido';
      } else if (doc.length === 14) {
        this.docError.textContent = this.validarCNPJ(doc)
          ? ''
          : 'CNPJ inválido';
      } else {
        this.docError.textContent = '';
      }
    });

    this.saveBtn.onclick = () => {
      if (this.docError.textContent) {
        alert('Corrija o documento antes de salvar.');
        return;
      }
      const data = {
        directory: this.dirInput.value,
        document: this.docInput.value,
      };
      window[String('electronAPI')].saveFormData(data);
      alert('Dados salvos com sucesso!');
    };

    this.cancelBtn.onclick = () => {
      window[String('electronAPI')].closeWindow();
    };
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const handler = new FormHandler();
  const data = await window[String('electronAPI')].loadFormData();
  if (data) {
    handler.dirInput.value = data.directory || '';
    handler.docInput.value = data.document || '';
  }
});
