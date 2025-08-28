import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Infinity, RefreshCw } from "lucide-react";

interface CreditDisplayProps {
  creditInfo: CreditInfo;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export function CreditDisplay({ creditInfo, isRefreshing = false, onRefresh }: CreditDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const getUsagePercentage = () => {
    if (creditInfo.isUnlimited || creditInfo.limit <= 0) return 0;
    return Math.min((creditInfo.usageThisMonth / creditInfo.limit) * 100, 100);
  };

  const getRemainingCredit = () => {
    if (creditInfo.isUnlimited) return null;
    return Math.max(creditInfo.limit - creditInfo.usageThisMonth, 0);
  };

  const usagePercentage = getUsagePercentage();
  const remainingCredit = getRemainingCredit();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium text-sm">Credit Usage</span>
          </div>
          
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {/* Balance */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Current Balance:</span>
            <span className="text-sm font-medium">
              {formatCurrency(creditInfo.balance)}
            </span>
          </div>

          {/* Usage this month */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Used This Month:</span>
            <span className="text-sm font-medium text-red-600">
              {formatCurrency(creditInfo.usageThisMonth)}
            </span>
          </div>

          {/* Limit and remaining */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Monthly Limit:</span>
            <span className="text-sm font-medium flex items-center gap-1">
              {creditInfo.isUnlimited ? (
                <>
                  <Infinity className="h-3 w-3" />
                  <span>Unlimited</span>
                </>
              ) : (
                formatCurrency(creditInfo.limit)
              )}
            </span>
          </div>

          {!creditInfo.isUnlimited && remainingCredit !== null && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Remaining:</span>
                <span className={`text-sm font-medium ${
                  remainingCredit < creditInfo.limit * 0.1 ? 'text-red-600' : 
                  remainingCredit < creditInfo.limit * 0.3 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {formatCurrency(remainingCredit)}
                </span>
              </div>

              {/* Usage bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="text-muted-foreground">{usagePercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      usagePercentage >= 90 ? 'bg-red-500' :
                      usagePercentage >= 70 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Rate limits */}
          {creditInfo.rateLimitPerMinute && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Rate Limit:</span>
              <span className="text-sm font-medium">
                {creditInfo.rateLimitPerMinute}/min
              </span>
            </div>
          )}

          {/* Key label */}
          {creditInfo.label && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Key Label:</span>
              <span className="text-sm font-medium truncate max-w-32">
                {creditInfo.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}