import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { I18nService } from './I18nService';

@Component({
    selector: 'contractor-details',
    templateUrl: './contractor-details.component.html'
})

export class ContractorDetailsComponent { 
    @Input() apiResponse: any;
    @Input() locale: string;    
    @Input() projectsPath: string;    
    @Input() procurementPath: string;    

    detailsLabel: string;
    projectIdLabel: string;    
    projectId: string;
    projectTitleLabel: string;    
    projectTitle: string;     
    countryLabel: string;
    countryName: string;
    teamLeaderLabel: string;
    teamLeader: string;
    borrowerContractReferenceLabel: string;
    borrowerContractReference: string
    noObjectionDateLabel: string;
    noObjectionDate: string;
    signingDateLabel: string;
    signingDate: string;
    contractNoLabel: string;
    contractNo: string;
    totalContractAmountLabel: string;
    totalContractAmount: string;
    procurementGroupLabel: string;
    procurementGroup: string;
    procurementMethodLabel: string;
    procurementMethod: string;
    procurementTypeLabel: string;
    procurementType: string;
    noData: string;
    contractorNameLabel: string;
    contractorCountryLabel: string;
    supplierInfo: any[] = [];
    
    ngOnChanges() {  
        this.detailsLabel = I18nService.CONTRACTOR_DETAILS[this.locale].detailsLabel;
        this.projectIdLabel = I18nService.CONTRACTOR_DETAILS[this.locale].projectIdLabel;    
        this.projectTitleLabel = I18nService.CONTRACTOR_DETAILS[this.locale].projectTitleLabel;    
        this.countryLabel = I18nService.CONTRACTOR_DETAILS[this.locale].countryLabel;
        this.teamLeaderLabel = I18nService.CONTRACTOR_DETAILS[this.locale].teamLeaderLabel;
        this.borrowerContractReferenceLabel = I18nService.CONTRACTOR_DETAILS[this.locale].borrowerContractReferenceLabel;
        this.noObjectionDateLabel = I18nService.CONTRACTOR_DETAILS[this.locale].noObjectionDateLabel;
        this.signingDateLabel = I18nService.CONTRACTOR_DETAILS[this.locale].signingDateLabel;
        this.contractNoLabel = I18nService.CONTRACTOR_DETAILS[this.locale].contractNoLabel;
        this.totalContractAmountLabel = I18nService.CONTRACTOR_DETAILS[this.locale].totalContractAmountLabel;
        this.procurementGroupLabel = I18nService.CONTRACTOR_DETAILS[this.locale].procurementGroupLabel;
        this.procurementMethodLabel = I18nService.CONTRACTOR_DETAILS[this.locale].procurementMethodLabel;
        this.procurementTypeLabel = I18nService.CONTRACTOR_DETAILS[this.locale].procurementTypeLabel;       
        this.noData = I18nService.CONTRACTOR_DETAILS[this.locale].noData;       
        this.contractorNameLabel = I18nService.CONTRACTOR_DETAILS[this.locale].contractorNameLabel;       
        this.contractorCountryLabel = I18nService.CONTRACTOR_DETAILS[this.locale].contractorCountryLabel;       

        if (this.apiResponse != undefined) {  
            if(this.apiResponse.hasOwnProperty('contract')) {
                if (this.apiResponse['contract'].length > 0) {
                    let contract = this.apiResponse['contract'][0];
                    
                    this.projectId = contract.projectid;
                    this.projectTitle = contract.project_name;
                    this.countryName = contract.supplier_countryshortname[0];
                    this.teamLeader = contract.teammemfullname;
                    this.borrowerContractReference = contract.contr_refnum;
                    this.noObjectionDate = contract.hasOwnProperty('contr_no_obj_dat') ? this.getFormateDate(contract.contr_no_obj_dat, this.locale) : this.noData;
                    this.signingDate = contract.hasOwnProperty('contr_sgn_date') ? this.getFormateDate(contract.contr_sgn_date, this.locale) : this.noData;;
                    this.contractNo = contract.contr_id;
                    this.totalContractAmount = contract.hasOwnProperty('total_contr_amnt') ? this.convertCurrency(contract.total_contr_amnt, this.locale) : this.convertCurrency(0, this.locale);
                    this.procurementGroup = contract.hasOwnProperty('procurement_group_desc') ? contract.procurement_group_desc : this.noData;
                    this.procurementMethod = contract.hasOwnProperty('procu_meth_text') ? contract.procu_meth_text : this.noData;
                    this.procurementType = this.noData;        

                    if (contract.hasOwnProperty('suppinfo')) {
                        let supplierInfo = contract.suppinfo;
                        if (supplierInfo[0].id.indexOf('|') === -1) {
                            this.supplierInfo.push(supplierInfo[0]);
                        } else {
                            let supplierIds = (supplierInfo[0].id).indexOf('|') === -1 ? supplierInfo[0].id : (supplierInfo[0].id).split('|');
                            let supplierNames = (supplierInfo[0].name).indexOf('|') === -1 ? supplierInfo[0].id : (supplierInfo[0].name).split('|');
                            let supplierCountryNames = (supplierInfo[0].countryshortname).indexOf('|') === -1 ? supplierInfo[0].id : (supplierInfo[0].countryshortname).split('|');
    
                            supplierIds.forEach((supplierId, index) => {
                                this.supplierInfo.push({
                                    id: supplierId,
                                    name: supplierNames[index] == undefined ? '' : supplierNames[index],
                                    countryshortname: supplierCountryNames[index] == undefined ? '' : supplierCountryNames[index]
                                });
                            }); 
                        }
                    }
                }
            }
        }
    }

    public getFormateDate(date, locale) {
        let m = moment.utc(date, "DD-MMM-YYYY", true).isValid() ? moment.utc(date, "DD-MMM-YYYY", true): moment.utc(date);        
        let formatedDate = '';
        if (locale === 'en') 
            formatedDate = m.locale(locale).format('MMMM D, YYYY');
        else if (locale === 'es' || locale === 'pt')            
            formatedDate = m.locale(locale).format('D [de] MMMM [de] YYYY');
        else if (locale === 'fr')
            formatedDate = m.locale(locale).format('D MMMM YYYY');
        else if (locale === 'ru')
            formatedDate = m.locale(locale).format('D MMMM YYYY [года]');
        else if (locale === 'ar')            
            formatedDate = m.format('YYYY[/]MM[/]DD');
        else if (locale === 'zh')            
            formatedDate = m.format('YYYY[年]M[月]D[日]');
         
        return formatedDate;
    }
    
    public convertCurrency(currency, locale) {
        let amount = currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let formatedCurrency = '';
        if (locale === 'en') 
            formatedCurrency = 'US$ ' + amount;
        else if (locale === 'es')            
            formatedCurrency = 'US$ ' + amount;
        else if (locale === 'fr')
            formatedCurrency = 'USD ' + amount;
        else if (locale === 'pt')
            formatedCurrency = 'US$ ' + amount;
        else if (locale === 'ru')
            formatedCurrency = 'ДОЛЛ. США ' + amount;
        else if (locale === 'ar')
            formatedCurrency = 'دولار أمريكي ' + amount;
        else if (locale === 'zh')
            formatedCurrency = '美元 ' + amount;

        return formatedCurrency;              
    }  
}