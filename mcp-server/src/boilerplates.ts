/**
 * Boilerplates - Templates básicos para geração de código ADVPL/TLPP
 * 
 * Phase 5: Integration with Function Validator
 * - Valida templates antes de retornar
 * - Identifica funções fictícias e incompatibilidades de linguagem
 * - Retorna erros com sugestões de correção
 */

import { TemplateValidator, TemplateValidationResult } from "./template-validator.js";

export interface Boilerplate {
  filename: string;
  content: string;
  validation?: TemplateValidationResult;
}

export class BoilerplateGenerator {
  public static generate(type: string, name: string, module: string = "GEN", lang: string = "advpl"): Boilerplate {
    const date = new Date().toLocaleDateString("pt-BR");
    const extension = lang === "tlpp" ? ".tlpp" : ".prw";
    const filename = `${name}${extension}`;

    let content = "";

    switch (type.toLowerCase()) {
      case "function":
        content = this.getFunctionTemplate(name, module, date);
        break;
      case "class":
        content = this.getClassTemplate(name, module, date);
        break;
      case "mvc":
        content = this.getMVCTemplate(name, module, date);
        break;
      case "rest":
        content = lang === "tlpp" ? this.getRestTlppTemplate(name, module, date) : this.getRestAdvplTemplate(name, module, date);
        break;
      default:
        content = this.getGenericTemplate(name, module, date, extension);
    }

    // Phase 5: Valida template antes de retornar
    const validation = TemplateValidator.validate(content, filename, lang as "advpl" | "tlpp");
    
    return { 
      filename, 
      content,
      validation 
    };
  }

  private static getHeader(name: string, type: string, module: string, date: string): string {
    return `/*/{Protheus.doc} ${name}
${type} especializada para o modulo ${module}
@type function
@author Advpl Sensei
@since ${date}
@version 1.0
/*/`;
  }

  private static getFunctionTemplate(name: string, module: string, date: string): string {
    return `#Include "TOTVS.CH"

${this.getHeader(name, "User Function", module, date)}
User Function ${name}()
    Local lRet := .T.
    
    Begin Sequence
        // Logica de negocio aqui
    End Sequence

Return lRet
`;
  }

  private static getClassTemplate(name: string, module: string, date: string): string {
    return `#Include "TOTVS.CH"
#Include "TLPP.CH"

namespace ${module.toLowerCase()}

${this.getHeader(name, "Classe", module, date)}
Class ${name}
    Public Data cId      as String
    Public Data nValor   as Numeric
    
    Public Method New()
    Public Method Process()
EndClass

Method New() Class ${name}
    ::cId    := ""
    ::nValor := 0
Return Self

Method Process() Class ${name}
    Local lOk := .T.
Return lOk
`;
  }

  private static getMVCTemplate(name: string, module: string, date: string): string {
    return `#Include "TOTVS.CH"
#Include "FWMVCDef.ch"

${this.getHeader(name, "Rotina MVC", module, date)}
User Function ${name}()
    Local oBrowse := Nil

    oBrowse := FWMBrowse():New()
    oBrowse:SetAlias("SA1") // Ajustar para a tabela correta
    oBrowse:SetDescription("Cadastro de ${name}")
    oBrowse:Activate()

Return Nil

Static Function MenuDef()
    Local aRotina := {}
    ADD OPTION aRotina TITLE "Visualizar" ACTION "VIEWDEF.${name}" OPERATION MODEL_OPERATION_VIEW   ACCESS 0
    ADD OPTION aRotina TITLE "Incluir"    ACTION "VIEWDEF.${name}" OPERATION MODEL_OPERATION_INSERT ACCESS 0
    ADD OPTION aRotina TITLE "Alterar"    ACTION "VIEWDEF.${name}" OPERATION MODEL_OPERATION_UPDATE ACCESS 0
    ADD OPTION aRotina TITLE "Excluir"    ACTION "VIEWDEF.${name}" OPERATION MODEL_OPERATION_DELETE ACCESS 0
Return aRotina

Static Function ModelDef()
    Local oModel  := Nil
    Local oStruct := FWFormStruct(1, "SA1")

    oModel := MPFormModel():New("${name}", /*bPreValid*/, /*bPosValid*/, /*bCommit*/, /*bCancel*/)
    oModel:SetDescription("Modelo de Dados - ${name}")
    oModel:AddFields("MASTER", /*owner*/, oStruct)
    oModel:SetPrimaryKey({"A1_FILIAL", "A1_COD", "A1_LOJA"})

Return oModel

Static Function ViewDef()
    Local oView   := Nil
    Local oModel  := FWLoadModel("${name}")
    Local oStruct := FWFormStruct(2, "SA1")

    oView := FWFormView():New()
    oView:SetModel(oModel)
    oView:AddField("VIEW_MASTER", oStruct, "MASTER")
    oView:CreateHorizontalBox("TELA", 100)
    oView:SetOwnerView("VIEW_MASTER", "TELA")
    oView:EnableTitleView("VIEW_MASTER", "Dados do Registro")

Return oView
`;
  }

  private static getRestTlppTemplate(name: string, module: string, date: string): string {
    return `#Include "TOTVS.CH"
#Include "TLPP.CH"

${this.getHeader(name, "REST API (TLPP)", module, date)}

// Note: TLPP REST implementation uses class-based approach
// For REST endpoints, consider using FWRest class or WSRESTFUL with TLPP syntax

namespace ${module.toLowerCase()}

Class ${name}Rest
    Public cStatus   as String
    Public cMessage  as String
    Public oResponse as Object
    
    Public Method New() as Self
    Public Method HandleGet() as Logical
    Public Method HandlePost() as Logical
    Public Method GetResponse() as String
EndClass

Method New() Class ${name}Rest
    ::cStatus   := "success"
    ::cMessage  := ""
    ::oResponse := JsonObject():New()
Return Self

Method HandleGet() Class ${name}Rest
    Local lOk := .T.
    
    Begin Sequence
        // Implementar logica GET aqui
        ::oResponse["status"]  := .T.
        ::oResponse["message"] := "GET processado com sucesso"
    Except
        lOk := .F.
    End Sequence
    
Return lOk

Method HandlePost() Class ${name}Rest
    Local lOk := .T.
    
    Begin Sequence
        // Implementar logica POST aqui
        // Dados podem vir do request body
        ::oResponse["status"]  := .T.
        ::oResponse["message"] := "POST processado com sucesso"
    Except
        lOk := .F.
    End Sequence
    
Return lOk

Method GetResponse() Class ${name}Rest
Return ::oResponse:ToJSON()
`;
  }

  private static getRestAdvplTemplate(name: string, module: string, date: string): string {
    return `#Include "TOTVS.CH"
#Include "RESTFUL.CH"

${this.getHeader(name, "REST API (ADVPL)", module, date)}
WSRESTFUL ${name} DESCRIPTION "Servico REST para ${name}"
    WSDATA cId as String
    
    WSMETHOD GET DESCRIPTION "Retorna dados" WSSYNTAX "/${name}"
    WSMETHOD POST DESCRIPTION "Envia dados" WSSYNTAX "/${name}"
END WSRESTFUL

WSMETHOD GET WSSERVICE ${name}
    Local lRet := .T.
    ::SetContentType("application/json")
    ::SetResponse('{"status": true}')
Return lRet

WSMETHOD POST WSSERVICE ${name}
    Local lRet := .T.
    ::SetContentType("application/json")
    ::SetResponse('{"status": true}')
Return lRet
`;
  }

  private static getGenericTemplate(name: string, module: string, date: string, ext: string): string {
    return `#Include "TOTVS.CH"

${this.getHeader(name, "Rotina", module, date)}
Function ${name}()
Return Nil
`;
  }
}
