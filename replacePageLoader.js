const fs = require('fs');
const path = require('path');
const files = [
    "src/app/(user)/profile/page.tsx",
    "src/app/(dashboard)/(list)/users/[userID]/page.tsx",
    "src/app/(dashboard)/(list)/sale-report/page.tsx",
    "src/app/(dashboard)/(list)/users/page.tsx",
    "src/app/(dashboard)/(list)/quotations/[quotationID]/page.tsx",
    "src/app/(dashboard)/(list)/orders/page.tsx",
    "src/app/(dashboard)/(list)/orders/[orderID]/page.tsx",
    "src/app/(dashboard)/(list)/orders/OrderHeader.tsx",
    "src/app/(dashboard)/(list)/customers/page.tsx",
    "src/app/(dashboard)/(list)/customers/[customerID]/page.tsx"
];

for (const file of files) {
    let p = path.join(process.cwd(), file);
    if (!fs.existsSync(p)) continue;
    let content = fs.readFileSync(p, 'utf8');
    if (content.includes('PageLoader')) {
        content = content.replace(/import PageLoader.*?;[\r\n]*/g, '');
        if (!content.includes('import FetchingLoadingStatus')) {
            content = 'import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";\n' + content;
        }
        content = content.replace(/<PageLoader\s*\/?>(?:<\/PageLoader>)?/g, '<FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />');
        fs.writeFileSync(p, content);
    }
}
