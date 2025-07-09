import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ArrowUpDown, Calendar, CreditCard, Filter, Download, ArrowUp, ArrowDown } from 'lucide-react';

export interface BillItem {
  id: number;
  name: string;
  amount: number;
  dueDate: Date | string;
  entityId: number;
  entityName: string;
  category: string;
  status: 'paid' | 'pending' | 'overdue';
  recurringType?: 'monthly' | 'quarterly' | 'annual' | 'one-time';
}

interface UpcomingBillsTableProps {
  bills: BillItem[];
  entityId?: number | 'all';
  limit?: number;
  showHeader?: boolean;
}

export default function UpcomingBillsTable({ 
  bills, 
  entityId = 'all',
  limit,
  showHeader = false
}: UpcomingBillsTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedBills, setSelectedBills] = useState<number[]>([]);

  // Filter bills based on entity, status, category and search term
  const filteredBills = bills
    .filter(bill => {
      if (entityId === 'all') return true;
      return bill.entityId === entityId;
    })
    .filter(bill => {
      if (selectedStatus === 'all') return true;
      return bill.status === selectedStatus;
    })
    .filter(bill => {
      if (selectedCategory === 'all') return true;
      return bill.category === selectedCategory;
    })
    .filter(bill => {
      if (!searchTerm) return true;
      return (
        bill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  // Sort the bills
  const sortedBills = [...filteredBills].sort((a, b) => {
    if (sortField === 'dueDate') {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === 'entity') {
      return sortDirection === 'asc' 
        ? a.entityName.localeCompare(b.entityName) 
        : b.entityName.localeCompare(a.entityName);
    } else if (sortField === 'category') {
      return sortDirection === 'asc' 
        ? a.category.localeCompare(b.category) 
        : b.category.localeCompare(a.category);
    }
    return 0;
  });

  // Get the limited list of bills
  const displayedBills = limit ? sortedBills.slice(0, limit) : sortedBills;

  // Get all categories for the filter
  const categories = Array.from(new Set(bills.map(bill => bill.category)));

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Toggle bill selection
  const toggleBillSelection = (id: number) => {
    if (selectedBills.includes(id)) {
      setSelectedBills(selectedBills.filter(billId => billId !== id));
    } else {
      setSelectedBills([...selectedBills, id]);
    }
  };

  // Select all visible bills
  const selectAllBills = () => {
    if (selectedBills.length === displayedBills.length) {
      setSelectedBills([]);
    } else {
      setSelectedBills(displayedBills.map(bill => bill.id));
    }
  };

  // Get badge for bill status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get class for row based on status
  const getRowClass = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'paid':
        return '';
      default:
        return '';
    }
  };

  // Get recurring type label
  const getRecurringTypeLabel = (type?: string) => {
    switch (type) {
      case 'monthly':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Monthly</Badge>;
      case 'quarterly':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">Quarterly</Badge>;
      case 'annual':
        return <Badge variant="outline" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">Annual</Badge>;
      case 'one-time':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">One-time</Badge>;
      default:
        return null;
    }
  };

  // Calculate total
  const totalAmount = displayedBills.reduce((sum, bill) => sum + bill.amount, 0);
  const selectedTotal = selectedBills.length > 0 
    ? bills
      .filter(bill => selectedBills.includes(bill.id))
      .reduce((sum, bill) => sum + bill.amount, 0)
    : 0;

  return (
    <Card>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Bills & Expenses</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <CreditCard className="h-4 w-4" />
              Pay Selected
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="space-y-4">
          {showHeader && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search bills..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {displayedBills.length > 0 ? (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedBills.length === displayedBills.length && displayedBills.length > 0}
                          onCheckedChange={selectAllBills}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-1">
                          Bill Name
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="h-4 w-4" /> : 
                              <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('dueDate')}>
                        <div className="flex items-center gap-1">
                          Due Date
                          {sortField === 'dueDate' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="h-4 w-4" /> : 
                              <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                        <div className="flex items-center gap-1">
                          Amount
                          {sortField === 'amount' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="h-4 w-4" /> : 
                              <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      {entityId === 'all' && (
                        <TableHead className="cursor-pointer" onClick={() => handleSort('entity')}>
                          <div className="flex items-center gap-1">
                            Entity
                            {sortField === 'entity' && (
                              sortDirection === 'asc' ? 
                                <ArrowUp className="h-4 w-4" /> : 
                                <ArrowDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                      )}
                      <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                        <div className="flex items-center gap-1">
                          Category
                          {sortField === 'category' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="h-4 w-4" /> : 
                              <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedBills.map((bill) => (
                      <TableRow key={bill.id} className={getRowClass(bill.status)}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedBills.includes(bill.id)}
                            onCheckedChange={() => toggleBillSelection(bill.id)}
                            aria-label={`Select ${bill.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{bill.name}</TableCell>
                        <TableCell>{formatDate(bill.dueDate)}</TableCell>
                        <TableCell>{formatCurrency(bill.amount)}</TableCell>
                        {entityId === 'all' && (
                          <TableCell>{bill.entityName}</TableCell>
                        )}
                        <TableCell>{bill.category}</TableCell>
                        <TableCell>{getStatusBadge(bill.status)}</TableCell>
                        <TableCell>{getRecurringTypeLabel(bill.recurringType)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  {selectedBills.length > 0 ? (
                    <span>{selectedBills.length} bills selected ({formatCurrency(selectedTotal)})</span>
                  ) : (
                    <span>Total: {displayedBills.length} bills ({formatCurrency(totalAmount)})</span>
                  )}
                </div>
                {!limit && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <CreditCard className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No bills found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' 
                  ? "Try adjusting your filters or search term"
                  : "There are no upcoming bills to display at this time"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}