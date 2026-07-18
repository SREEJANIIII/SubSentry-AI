const OFFICIAL_UPI_HANDLES = [
  'paytm', 'gpay', 'googlepay', 'phonepe', 'amazonpay', 'amazon', 'flipkart',
  'sbi', 'hdfcbank', 'hdfc', 'icici', 'icicibank', 'axisbank', 'axis',
  'kotak', 'kotakbank', 'yesbank', 'yesbankltd', 'indusind', 'indusindbank',
  'pnb', 'pnbindia', 'bankofbaroda', 'bob', 'canarabank', 'canara',
  'unionbank', 'unionbankofindia', 'indianbank', 'indianbankltd',
  'bankofindia', 'boi', 'centralbank', 'centralbankofindia',
  'uco', 'ucobank', 'punjabandsind', 'punjabandsindbank',
  'mahabank', 'bankofmaharashtra', 'idfc', 'idfcbank',
  'federal', 'federalbank', 'southindian', 'southindianbank',
  'karur', 'karurvysya', 'kvb', 'cityunion', 'cityunionbank',
  'dhanlaxmi', 'dhanlaxmibank', 'tmb', 'tamilnadmercantile',
  'jio', 'jiobank', 'airtel', 'airtelpaymentsbank',
  'fino', 'finopaymentsbank', 'india', 'indiapost', 'ippb',
  'nsdl', 'nsdlpaymentsbank', 'fino', 'finofinance',
  'cashfree', 'razorpay', 'payu', 'ccavenue', 'billdesk',
  'instamojo', 'zaakpay', 'bhim', 'bhimupi',
  'sbipay', 'icicipay', 'hdfcpay', 'axispay', 'kotakpay',
  'paytmupi', 'phonepeupi', 'gpayupi'
];

const OFFICIAL_DOMAINS = [
  'paytm.com', 'gpay.google.com', 'googlepay.com', 'phonepe.com',
  'amazon.in', 'amazonpay.in', 'flipkart.com', 'sbi.co.in',
  'hdfcbank.com', 'icicibank.com', 'axisbank.com', 'kotak.com',
  'yesbank.in', 'indusind.com', 'pnbindia.in', 'bankofbaroda.in',
  'canarabank.com', 'unionbankofindia.co.in', 'indianbank.in',
  'bankofindia.co.in', 'centralbankofindia.co.in', 'ucobank.com',
  'punjabandsindbank.co.in', 'bankofmaharashtra.in', 'idfcfirstbank.com',
  'federalbank.co.in', 'southindianbank.com', 'kvb.co.in',
  'cityunionbank.com', 'dhanlaxmibank.com', 'tmb.in',
  'jio.com', 'airtel.in', 'ippbonline.com', 'nsdl.co.in',
  'finofinance.com', 'cashfree.com', 'razorpay.com', 'payu.in',
  'ccavenue.com', 'billdesk.com', 'instamojo.com', 'zaakpay.com',
  'bhimupi.org.in', 'upi.npci.org.in', 'sbipay.in', 'icicipay.in',
  'hdfcpay.in', 'axispay.in', 'kotakpay.in'
];

const PHISHING_KEYWORDS = [
  'verify', 'verify-account', 'verify-account-now', 'verify-now',
  'kyc', 'kyc-update', 'kyc-pending', 'complete-kyc',
  'urgent', 'urgent-action', 'immediate', 'immediate-action',
  'limited-time', 'act-now', 'expire', 'expires', 'expiring',
  'suspend', 'suspended', 'suspension', 'block', 'blocked',
  'unblock', 'unblock-now', 'reactivate', 'reactivate-now',
  'update', 'update-now', 'update-details', 'update-info',
  'confirm', 'confirm-now', 'confirm-account', 'confirm-details',
  'validate', 'validate-now', 'validate-account',
  'authenticate', 'authenticate-now', 'authenticate-account',
  'secure', 'secure-account', 'secure-now', 'security-alert',
  'alert', 'alert-action', 'warning', 'warning-action',
  'notice', 'notice-action', 'important', 'important-action',
  'action-required', 'action-needed', 'required-action',
  'pending', 'pending-action', 'pending-verification',
  'refund', 'refund-pending', 'refund-initiated', 'claim-refund',
  'cashback', 'cashback-offer', 'reward', 'reward-pending',
  'bonus', 'bonus-pending', 'gift', 'gift-card', 'voucher',
  'prize', 'winner', 'congratulations', 'selected', 'lucky',
  'offer', 'special-offer', 'limited-offer', 'exclusive-offer',
  'discount', 'flat-discount', 'upto', 'percent-off',
  'free', 'free-gift', 'free-cashback', 'free-money',
  'instant', 'instant-cash', 'instant-approval', 'instant-transfer',
  'fast', 'fast-track', 'quick', 'quick-cash', 'quick-approval',
  'easy', 'easy-cash', 'easy-approval', 'hassle-free',
  'guaranteed', 'guaranteed-approval', 'guaranteed-cash',
  'pre-approved', 'pre-approved-offer', 'eligible', 'eligibility',
  'loan', 'personal-loan', 'instant-loan', 'quick-loan',
  'credit', 'credit-card', 'credit-limit', 'increase-limit',
  'upi', 'upi-pin', 'upi-id', 'upi-verification', 'upi-update',
  'vpa', 'vpa-verification', 'vpa-update', 'handle',
  'bank-account', 'bank-details', 'account-details',
  'account-number', 'account-verification', 'ifsc', 'micr',
  'debit', 'debit-card', 'credit-card', 'card-details',
  'cvv', 'otp', 'pin', 'password', 'credentials',
  'login', 'signin', 'sign-in', 'access', 'access-account',
  'portal', 'dashboard', 'panel', 'admin', 'support',
  'helpdesk', 'customer-care', 'helpline', 'tollfree',
  'whatsapp', 'telegram', 'signal', 'contact-us', 'reach-us',
  'callback', 'call-back', 'missed-call', 'give-missed-call',
  'click', 'click-here', 'click-now', 'tap', 'tap-here',
  'link', 'link-below', 'link-above', 'visit', 'visit-now',
  'redirect', 'redirecting', 'proceed', 'proceed-now',
  'continue', 'continue-now', 'next', 'next-step',
  'submit', 'submit-now', 'apply', 'apply-now', 'register',
  'register-now', 'signup', 'sign-up', 'enroll', 'enroll-now',
];

const SUSPICIOUS_TLDS = new Set([
  'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'club', 'online',
  'site', 'website', 'space', 'tech', 'info', 'biz', 'work',
  'live', 'fun', 'win', 'bid', 'racing', 'download', 'stream',
  'science', 'party', 'review', 'trade', 'date', 'faith', 'loan',
  'accountant', 'cricket', 'energy', 'engineer', 'gdn', 'men',
  'mom', 'pics', 'red', 'kim', 'blue', 'ink', 'wiki', 'design',
  'center', 'cool', 'earth', 'zone', 'solutions', 'company',
  'today', 'news', 'email', 'mail', 'post', 'host', 'cloud',
  'systems', 'network', 'digital', 'software', 'technology',
  'services', 'agency', 'consulting', 'expert', 'guru', 'ninja',
  'rocks', 'social', 'media', 'marketing', 'advertising', 'promo',
  'deal', 'sale', 'shop', 'store', 'buy', 'order', 'cart',
  'payment', 'pay', 'billing', 'invoice', 'checkout', 'cart',
  'secure', 'security', 'protect', 'protection', 'safe', 'safety',
  'guard', 'shield', 'defend', 'securepay', 'safepay', 'trustpay',
  'verifyme', 'verifyyou', 'verifyus', 'kycnow', 'kyconline',
  'upiverify', 'upipay', 'vpaonline', 'vpacheck', 'bankverify',
  'bankkyc', 'banksecure', 'banksafe', 'accountverify', 'accountkyc',
]);

const SUSPICIOUS_SUBDOMAINS = new Set([
  'www', 'mail', 'email', 'webmail', 'smtp', 'pop', 'imap',
  'ftp', 'sftp', 'ssh', 'vpn', 'remote', 'vpn', 'proxy',
  'cdn', 'static', 'assets', 'media', 'images', 'img', 'css',
  'js', 'script', 'api', 'app', 'mobile', 'm', 'wap', 'touch',
  'beta', 'dev', 'test', 'staging', 'stage', 'qa', 'uat',
  'demo', 'sandbox', 'playground', 'preview', 'staging',
  'admin', 'administrator', 'root', 'system', 'manage',
  'panel', 'control', 'dashboard', 'console', 'portal',
  'secure', 'security', 'ssl', 'tls', 'https', 'http',
  'login', 'signin', 'signup', 'register', 'auth', 'sso',
  'saml', 'oauth', 'oidc', 'ldap', 'adfs', 'cas', 'shibboleth',
  'verify', 'verification', 'validate', 'validation', 'confirm',
  'confirmation', 'authenticate', 'authentication', 'kyc',
  'support', 'help', 'helpdesk', 'care', 'service', 'services',
  'contact', 'contactus', 'reachus', 'feedback', 'complaint',
  'grievance', 'nodal', 'escalation', 'ombudsman', 'rbi',
  'npci', 'uidai', 'aadhaar', 'pan', 'gst', 'tan', 'cin',
  'incometax', 'income-tax', 'tax', 'return', 'filing', 'efiling',
  'gstn', 'gstportal', 'gst.gov.in', 'incometax.gov.in',
]);

function isValidUpiFormat(upi) {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z][a-zA-Z0-9.\-]{1,64}$/;
  return upiRegex.test(upi);
}

function extractDomain(url) {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.toLowerCase();
  } catch {
    const match = url.match(/^(?:https?:\/\/)?([^\/]+)/i);
    return match ? match[1].toLowerCase() : '';
  }
}

function getDomainParts(domain) {
  const parts = domain.split('.');
  if (parts.length < 2) return { subdomain: '', domain: '', tld: '' };
  const tld = parts.pop();
  const domainName = parts.pop();
  const subdomain = parts.join('.');
  return { subdomain, domain: domainName, tld };
}

function isOfficialDomain(domain) {
  const domainLower = domain.toLowerCase();
  return OFFICIAL_DOMAINS.some(d => domainLower === d || domainLower.endsWith(`.${d}`));
}

function isSuspiciousTld(tld) {
  return SUSPICIOUS_TLDS.has(tld.toLowerCase());
}

function isSuspiciousSubdomain(subdomain) {
  if (!subdomain) return false;
  const parts = subdomain.toLowerCase().split('.');
  return parts.some(p => SUSPICIOUS_SUBDOMAINS.has(p));
}

function hasPhishingKeywords(value) {
  const lower = value.toLowerCase();
  return PHISHING_KEYWORDS.some(kw => lower.includes(kw));
}

function hasOfficialBrand(value) {
  const lower = value.toLowerCase();
  return OFFICIAL_UPI_HANDLES.some(h => lower.includes(h));
}

function looksLikeOfficialUpi(value) {
  const lower = value.toLowerCase();
  const handlePart = lower.split('@')[0];
  const providerPart = lower.split('@')[1];
  
  if (!OFFICIAL_UPI_HANDLES.includes(providerPart)) return false;
  
  return handlePart === providerPart || 
         handlePart.startsWith(`${providerPart}.`) || 
         handlePart.endsWith(`.${providerPart}`) ||
         handlePart.includes(`${providerPart}pay`) ||
         handlePart.includes(`${providerPart}upi`);
}

function calculateRiskScore(input) {
  const value = String(input || '').trim().toLowerCase();
  if (!value) return { score: 0, reasons: ['No payment input provided.'] };

  const reasons = [];
  let score = 0;
  const isUrl = /^https?:\/\//i.test(value) || (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(value) && !value.includes('@'));
  const isUpi = value.includes('@') && !value.includes(' ') && !value.includes('/');

  if (isUrl) {
    const domain = extractDomain(value);
    const { subdomain, domain: domainName, tld } = getDomainParts(domain);

    if (!value.startsWith('https://')) {
      score += 25;
      reasons.push('Connection is not secured with HTTPS');
    }

    if (isSuspiciousTld(tld)) {
      score += 30;
      reasons.push(`Suspicious top-level domain: .${tld}`);
    }

    if (isSuspiciousSubdomain(subdomain)) {
      score += 20;
      reasons.push('Suspicious subdomain pattern detected');
    }

    if (hasPhishingKeywords(value)) {
      score += 35;
      reasons.push('Contains phishing-related keywords');
    }

    const hasBrand = hasOfficialBrand(value);
    if (hasBrand && !isOfficialDomain(domain)) {
      score += 40;
      reasons.push('Impersonates a known brand but uses an unofficial domain');
    } else if (hasBrand && isOfficialDomain(domain)) {
      score -= 10;
      reasons.push('Domain matches a known official payment provider');
    }

    if (/[0-9]/.test(domainName.replace(/[^a-z0-9]/g, '')) && !isOfficialDomain(domain)) {
      score += 15;
      reasons.push('Domain contains unusual numeric substitutions');
    }

    const suspiciousPatterns = [
      /paytm[-.]?pay/i, /gpay[-.]?pay/i, /phonepe[-.]?pay/i,
      /upi[-.]?pay/i, /bhim[-.]?pay/i, /pay[-.]?now/i,
      /pay[-.]?instant/i, /instant[-.]?pay/i, /quick[-.]?pay/i,
      /fast[-.]?pay/i, /easy[-.]?pay/i, /secure[-.]?pay/i,
      /safe[-.]?pay/i, /trust[-.]?pay/i, /verify[-.]?pay/i,
      /kyc[-.]?pay/i, /bank[-.]?pay/i, /account[-.]?pay/i,
    ];
    if (suspiciousPatterns.some(r => r.test(value)) && !isOfficialDomain(domain)) {
      score += 25;
      reasons.push('URL pattern mimics payment flow but uses unofficial domain');
    }

    if (domainName.length > 30) {
      score += 10;
      reasons.push('Unusually long domain name');
    }

    if ((domain.match(/-/g) || []).length > 3) {
      score += 10;
      reasons.push('Excessive hyphens in domain name');
    }
  }

  if (isUpi) {
    const [handle, provider] = value.split('@');
    const cleanProvider = provider.toLowerCase();

    if (!isValidUpiFormat(value)) {
      score += 20;
      reasons.push('Invalid UPI ID format');
    }

    if (handle.length > 20) {
      score += 15;
      reasons.push('Unusually long UPI handle');
    }

    if (handle.length < 3) {
      score += 10;
      reasons.push('Unusually short UPI handle');
    }

    if (/[^a-zA-Z0-9.\-_]/.test(handle)) {
      score += 15;
      reasons.push('UPI handle contains unusual characters');
    }

    if (hasPhishingKeywords(handle)) {
      score += 25;
      reasons.push('UPI handle contains phishing-related keywords');
    }

    if (OFFICIAL_UPI_HANDLES.includes(cleanProvider)) {
      const suspiciousHandlePatterns = [
        `^${cleanProvider}$`, // exact match
        `^${cleanProvider}\\.`, // starts with brand
        `\\.${cleanProvider}$`, // ends with brand
        `${cleanProvider}pay`,
        `${cleanProvider}upi`,
        `${cleanProvider}bank`,
        `${cleanProvider}secure`,
        `${cleanProvider}verify`,
        `${cleanProvider}kyc`,
        `${cleanProvider}support`,
        `${cleanProvider}help`,
        `${cleanProvider}admin`,
      ];
      const looksSuspicious = suspiciousHandlePatterns.some(p => new RegExp(p).test(handle));
      if (looksSuspicious) {
        score += 20;
        reasons.push('UPI handle mimics official brand pattern');
      } else {
        score -= 5;
        reasons.push('UPI handle appears to be a normal user handle');
      }
    } else if (/^[a-z]{2,}$/.test(cleanProvider)) {
      score += 10;
      reasons.push('UPI provider handle is generic or unknown');
    }

    if (/\d{6,}/.test(handle)) {
      score += 10;
      reasons.push('UPI handle contains long numeric sequence');
    }
  }

  if (!isUrl && !isUpi) {
    score += 15;
    reasons.push('Input does not resemble a valid UPI ID or payment URL');
  }

  if (reasons.length === 0) {
    score += 8;
    reasons.push('No strong red flags found in structure, but external verification is still recommended');
  }

  score = Math.max(0, Math.min(score, 96));
  return { score, reasons, isUrl, isUpi };
}

const paymentRiskService = {
  assess(input = '') {
    const { score, reasons, isUrl, isUpi } = calculateRiskScore(input);
    const value = String(input || '').trim().toLowerCase();

    let level = 'Low';
    if (score >= 60) level = 'High';
    else if (score >= 30) level = 'Medium';

    return { input: value, score, level, reasons, isUrl, isUpi };
  },
};

module.exports = { paymentRiskService };
