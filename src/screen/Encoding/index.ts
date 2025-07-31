"use strict";

import { crc16ccitt } from "./crc16";
import { BanksObject, BankInfo } from "./banks";

// ===== ID constants =====
const FieldID = {
    VERSION: "00",
    INIT_METHOD: "01",
    VIETQR: "38",
    CURRENCY: "53",
    AMOUNT: "54",
    NATION: "58",
    MERCHANT_NAME: "59",
    CITY: "60",
    CRC: "63",
} as const;

const ProviderFieldID = {
    GUID: "00",
    DATA: "01",
    SERVICE: "02",
} as const;

const VietQRConsumerFieldID = {
    BANK_BIN: "00",
    BANK_NUMBER: "01",
} as const;

const QRProviderGUID = {
    VIETQR: "A000000727",
} as const;

interface Consumer {
    bankBin: string;
    bankNumber: string;
}

interface Provider {
    guid: string;
    service: string;
    name: string;
}

interface Result {
    consumer: Consumer;
    provider: Provider;
    merchantName: string;
    nation: string;
    currency: string;
    amount: string;
    crc?: string;
}

interface ParsedResult {
    [x: string]: string | undefined;
    valid: boolean;
    message?: string;
    bin?: string;
    nation?: string;
    bankName?: string;
    bankCode?: string;
    accountNumber?: string;
    merchantName?: string;
    amount?: string;
}

function sliceContent(content: string) {
    const id = content.slice(0, 2);
    const length = Number(content.slice(2, 4));
    const value = content.slice(4, 4 + length);
    const nextValue = content.slice(4 + length);
    return { id, length, value, nextValue };
}

function genCRCCode(content: string): string {
    const crcCode = crc16ccitt(content).toString(16).toUpperCase();
    return `0000${crcCode}`.slice(-4);
}

function verifyCRC(content: string): boolean {
    const checkContent = content.slice(0, -4);
    const crcCode = content.slice(-4).toUpperCase();
    const genCrcCode = genCRCCode(checkContent);
    return crcCode === genCrcCode;
}

function resolveBankInfo(bin: string): Partial<BankInfo> & { name: string; code: string; swiftCode: string | null; vietQRStatus: number } {
    const tryBins = [bin, bin.slice(0, 6), bin.slice(0, 5), bin.slice(0, 4)];
    for (const b of tryBins) {
        const bank = Object.values(BanksObject).find(bank => bank.bin === b);
        if (bank) {
            return {
                name: bank.shortName || bank.name,
                code: bank.code,
                swiftCode: bank.swiftCode || null,
                vietQRStatus: bank.vietQRStatus,
            };
        }
    }
    return {
        name: "Không xác định",
        code: "UNKNOWN",
        swiftCode: null,
        vietQRStatus: -1,
    };
}

function parseVietQRConsumer(content: string, consumer: Consumer): void {
    let { id, value, nextValue } = sliceContent(content);
    if (id === VietQRConsumerFieldID.BANK_BIN) consumer.bankBin = value;
    if (id === VietQRConsumerFieldID.BANK_NUMBER) consumer.bankNumber = value;
    if (nextValue.length >= 4) parseVietQRConsumer(nextValue, consumer);
}

function parseProviderInfo(content: string, provider: Provider, consumer: Consumer): void {
    let { id, value, nextValue } = sliceContent(content);
    if (id === ProviderFieldID.GUID) provider.guid = value;
    if (id === ProviderFieldID.DATA && provider.guid === QRProviderGUID.VIETQR) {
        provider.name = "VIETQR";
        parseVietQRConsumer(value, consumer);
    }
    if (id === ProviderFieldID.SERVICE) provider.service = value;
    if (nextValue.length >= 4) parseProviderInfo(nextValue, provider, consumer);
}

function parseRootContent(content: string, result: Result): void {
    let { id, value, nextValue } = sliceContent(content);

    switch (id) {
        case FieldID.NATION:
            result.nation = value;
            break;
        case FieldID.MERCHANT_NAME:
            result.merchantName = value;
            break;
        case FieldID.CURRENCY:
            result.currency = value;
            break;
        case FieldID.AMOUNT:
            result.amount = value;
            break;
        case FieldID.VIETQR:
            parseProviderInfo(value, result.provider, result.consumer);
            break;
        case FieldID.CRC:
            result.crc = value;
            break;
    }

    if (nextValue.length >= 4) parseRootContent(nextValue, result);
}

export function decodeQR(content: string): ParsedResult {
    console.log("contentcontent", content);

    if (!verifyCRC(content.toString())) {
        return { valid: false, message: "Mã QR không hợp lệ (CRC sai)" };
    }

    const result: Result = {
        consumer: { bankBin: "", bankNumber: "" },
        provider: { guid: "", service: "", name: "" },
        merchantName: "",
        nation: "",
        currency: "",
        amount: "",
    };

    parseRootContent(content, result);
    const bankInfo = resolveBankInfo(result.consumer.bankBin);

    return {
        valid: true,
        bin: result.consumer.bankBin,
        nation: result.nation,
        bankName: bankInfo.name,
        bankCode: bankInfo.code,
        accountNumber: result.consumer.bankNumber,
        merchantName: result.merchantName,
        amount: result.amount,
    };
}
