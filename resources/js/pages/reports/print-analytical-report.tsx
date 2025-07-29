import AnalyticalReportPdf from '@/components/analytical-report';
import PdfWrapper from '@/components/pdf-wrapper';
import {
  AnalyticBestSelling,
  AnalyticBestSellingCategory,
  AnalyticsAverageTransaction,
  AnalyticsFilter,
  AnalyticsGrossProfit,
  AnalyticsRevenue,
  AnalyticsSalesTrend,
  AnalyticsTransaction,
} from '@/types';

interface AnalyticReportProps {
  revenue: AnalyticsRevenue;
  transaction: AnalyticsTransaction;
  grossProfit: AnalyticsGrossProfit;
  averageTransaction: AnalyticsAverageTransaction;
  getSalesTrend: AnalyticsSalesTrend;
  bestSellingItem: AnalyticBestSelling[];
  bestSellingCategory: AnalyticBestSellingCategory[];
  filters: AnalyticsFilter;
}

export default function PrintAnalyticalReport({
  revenue,
  transaction,
  grossProfit,
  averageTransaction,
  getSalesTrend,
  bestSellingCategory,
  bestSellingItem,
  filters,
}: AnalyticReportProps) {
  return (
    <PdfWrapper filename={`Laporan-Inventaris-${filters.startDate}`}>
      <AnalyticalReportPdf
        revenue={revenue}
        transaction={transaction}
        grossProfit={grossProfit}
        averageTransaction={averageTransaction}
        getSalesTrend={getSalesTrend}
        bestSellingCategory={bestSellingCategory}
        bestSellingItem={bestSellingItem}
        filters={filters}
      />
    </PdfWrapper>
  );
}
