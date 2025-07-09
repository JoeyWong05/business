import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VaultItemType } from "@shared/schema";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
  LockIcon,
  KeyIcon,
  FileTextIcon,
  CreditCardIcon,
  PlusIcon,
  StarIcon,
  TagIcon,
  SearchIcon,
  BuildingIcon,
  SaveIcon,
  CopyIcon,
  Trash2Icon,
  EyeIcon,
  EyeOffIcon,
  RefreshCwIcon,
} from "lucide-react";

interface PasswordVaultItem {
  id: number;
  name: string;
  username: string | null;
  password: string | null;
  url: string | null;
  notes: string | null;
  type: VaultItemType;
  tags: string[] | null;
  favorite: boolean | null;
  businessEntityId: number | null;
  toolId: number | null;
  companyId: number | null;
  expiryDate: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: number;
}

interface BusinessEntity {
  id: number;
  name: string;
}

interface Tool {
  id: number;
  name: string;
}

export default function PasswordVault() {
  const [selectedType, setSelectedType] = useState<VaultItemType | "all">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PasswordVaultItem | null>(null);
  const [passwordVisible, setPasswordVisible] = useState<Record<number, boolean>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for new/edit item
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    url: "",
    notes: "",
    type: VaultItemType.PASSWORD,
    tags: "",
    favorite: false,
    businessEntityId: null as number | null,
    toolId: null as number | null,
    companyId: null as number | null,
    expiryDate: ""
  });

  // Query to fetch vault items
  const { data: vaultData, isLoading } = useQuery({
    queryKey: ["/api/password-vault", selectedType, showFavoritesOnly, selectedEntityId],
    queryFn: async () => {
      let url = "/api/password-vault?";
      if (selectedType !== "all") url += `type=${selectedType}&`;
      if (showFavoritesOnly) url += "favorite=true&";
      if (selectedEntityId) url += `businessEntityId=${selectedEntityId}&`;
      
      return fetch(url, { credentials: "include" }).then(res => res.json());
    }
  });

  // Query to fetch business entities for filtering
  const { data: entitiesData } = useQuery({
    queryKey: ["/api/business-entities"],
    queryFn: async () => fetch("/api/business-entities", { credentials: "include" }).then(res => res.json())
  });

  // Query to fetch tools for form selection
  const { data: toolsData } = useQuery({
    queryKey: ["/api/tools"],
    queryFn: async () => fetch("/api/tools", { credentials: "include" }).then(res => res.json())
  });

  // Mutation to create a new vault item
  const createMutation = useMutation({
    mutationFn: async (data: Omit<PasswordVaultItem, "id" | "createdAt" | "updatedAt" | "userId">) => {
      return fetch("/api/password-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/password-vault"] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Item created",
        description: "The vault item has been successfully created."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create the vault item. Please try again.",
        variant: "destructive"
      });
      console.error("Error creating vault item:", error);
    }
  });

  // Mutation to update an existing vault item
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<PasswordVaultItem> }) => {
      return fetch(`/api/password-vault/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/password-vault"] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      toast({
        title: "Item updated",
        description: "The vault item has been successfully updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update the vault item. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating vault item:", error);
    }
  });

  // Mutation to delete a vault item
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return fetch(`/api/password-vault/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/password-vault"] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      toast({
        title: "Item deleted",
        description: "The vault item has been successfully deleted."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the vault item. Please try again.",
        variant: "destructive"
      });
      console.error("Error deleting vault item:", error);
    }
  });

  // Filtered items based on search query and selected filters
  const filteredItems = vaultData?.items.filter((item: PasswordVaultItem) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (item.name?.toLowerCase().includes(query)) ||
        (item.username?.toLowerCase().includes(query)) ||
        (item.url?.toLowerCase().includes(query)) ||
        (item.notes?.toLowerCase().includes(query)) ||
        (item.tags?.some((tag: string) => tag.toLowerCase().includes(query)))
      );
    }
    return true;
  }) || [];

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      password: "",
      url: "",
      notes: "",
      type: VaultItemType.PASSWORD,
      tags: "",
      favorite: false,
      businessEntityId: null,
      toolId: null,
      companyId: null,
      expiryDate: ""
    });
  };

  // Open edit dialog with selected item data
  const openEditDialog = (item: PasswordVaultItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || "",
      username: item.username || "",
      password: item.password || "",
      url: item.url || "",
      notes: item.notes || "",
      type: item.type,
      tags: item.tags ? item.tags.join(", ") : "",
      favorite: item.favorite || false,
      businessEntityId: item.businessEntityId,
      toolId: item.toolId,
      companyId: item.companyId,
      expiryDate: item.expiryDate || ""
    });
    setIsEditDialogOpen(true);
  };

  // Handle form submission for creating a new item
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : null
    };
    createMutation.mutate(submitData);
  };

  // Handle form submission for updating an item
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    const submitData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : null
    };
    updateMutation.mutate({ id: selectedItem.id, data: submitData });
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (!selectedItem) return;
    if (confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      deleteMutation.mutate(selectedItem.id);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (id: number) => {
    setPasswordVisible({
      ...passwordVisible,
      [id]: !passwordVisible[id]
    });
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard.`
      });
    });
  };

  // Render icon for vault item type
  const getItemTypeIcon = (type: VaultItemType) => {
    switch (type) {
      case VaultItemType.PASSWORD:
        return <LockIcon className="h-4 w-4" />;
      case VaultItemType.API_KEY:
        return <KeyIcon className="h-4 w-4" />;
      case VaultItemType.SECURE_NOTE:
        return <FileTextIcon className="h-4 w-4" />;
      case VaultItemType.CREDIT_CARD:
        return <CreditCardIcon className="h-4 w-4" />;
      case VaultItemType.OTP:
        return <RefreshCwIcon className="h-4 w-4" />;
      default:
        return <LockIcon className="h-4 w-4" />;
    }
  };

  // Get human-readable type name
  const getTypeLabel = (type: VaultItemType) => {
    switch (type) {
      case VaultItemType.PASSWORD:
        return "Password";
      case VaultItemType.API_KEY:
        return "API Key";
      case VaultItemType.SECURE_NOTE:
        return "Secure Note";
      case VaultItemType.CREDIT_CARD:
        return "Credit Card";
      case VaultItemType.OTP:
        return "OTP";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Password Vault</h1>
          <p className="text-muted-foreground">
            Securely store and manage passwords, API keys, and other sensitive information
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search vault..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => setSelectedType(value as VaultItemType | "all")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value={VaultItemType.PASSWORD}>Passwords</SelectItem>
                    <SelectItem value={VaultItemType.API_KEY}>API Keys</SelectItem>
                    <SelectItem value={VaultItemType.SECURE_NOTE}>Secure Notes</SelectItem>
                    <SelectItem value={VaultItemType.CREDIT_CARD}>Credit Cards</SelectItem>
                    <SelectItem value={VaultItemType.OTP}>OTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entity">Business Entity</Label>
                <Select
                  value={selectedEntityId?.toString() || "all"}
                  onValueChange={(value) => setSelectedEntityId(value === "all" ? null : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All entities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    {entitiesData?.entities.map((entity: BusinessEntity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="favorites"
                  checked={showFavoritesOnly}
                  onCheckedChange={(checked) => setShowFavoritesOnly(checked as boolean)}
                />
                <Label htmlFor="favorites" className="cursor-pointer">
                  Favorites only
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 flex justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading vault items...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex justify-center">
                <div className="text-center">
                  <LockIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No vault items found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchQuery || selectedType !== "all" || showFavoritesOnly || selectedEntityId
                      ? "Try adjusting your filters or search query"
                      : "Create your first vault item by clicking the 'Add New' button"}
                  </p>
                  {(searchQuery || selectedType !== "all" || showFavoritesOnly || selectedEntityId) && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedType("all");
                        setShowFavoritesOnly(false);
                        setSelectedEntityId(null);
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item: PasswordVaultItem) => (
                <Card key={item.id} className="overflow-hidden">
                  <div 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => openEditDialog(item)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {getItemTypeIcon(item.type)}
                          </div>
                          <CardTitle className="text-xl">{item.name}</CardTitle>
                          {item.favorite && (
                            <StarIcon className="h-4 w-4 text-yellow-500 ml-1" />
                          )}
                        </div>
                        <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                      </div>
                      {item.url && (
                        <CardDescription>
                          <a 
                            href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.url}
                          </a>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {item.username && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Username</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{item.username}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.username || "", "Username");
                              }}
                            >
                              <CopyIcon className="h-3 w-3" />
                              <span className="sr-only">Copy username</span>
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {item.password && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Password</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">
                              {passwordVisible[item.id] ? item.password : "••••••••"}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePasswordVisibility(item.id);
                              }}
                            >
                              {passwordVisible[item.id] ? (
                                <EyeOffIcon className="h-3 w-3" />
                              ) : (
                                <EyeIcon className="h-3 w-3" />
                              )}
                              <span className="sr-only">
                                {passwordVisible[item.id] ? "Hide" : "Show"} password
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.password || "", "Password");
                              }}
                            >
                              <CopyIcon className="h-3 w-3" />
                              <span className="sr-only">Copy password</span>
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Only show notes preview if available */}
                      {item.notes && (
                        <div className="mt-2">
                          <span className="text-sm font-medium">Notes</span>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.notes}</p>
                        </div>
                      )}
                      
                      {/* Show tags if available */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1 mt-3 flex-wrap">
                          {item.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add New Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Vault Item</DialogTitle>
            <DialogDescription>
              Create a new entry in your secure vault.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="type">Item Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={VaultItemType.PASSWORD}>Password</SelectItem>
                    <SelectItem value={VaultItemType.API_KEY}>API Key</SelectItem>
                    <SelectItem value={VaultItemType.SECURE_NOTE}>Secure Note</SelectItem>
                    <SelectItem value={VaultItemType.CREDIT_CARD}>Credit Card</SelectItem>
                    <SelectItem value={VaultItemType.OTP}>OTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {(formData.type === VaultItemType.PASSWORD || 
                formData.type === VaultItemType.API_KEY) && (
                <div className="space-y-2">
                  <Label htmlFor="username">
                    {formData.type === VaultItemType.API_KEY ? "Key ID / Name" : "Username / Email"}
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              {(formData.type === VaultItemType.PASSWORD || 
                formData.type === VaultItemType.API_KEY || 
                formData.type === VaultItemType.OTP) && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {formData.type === VaultItemType.API_KEY ? "API Key / Secret" : 
                      formData.type === VaultItemType.OTP ? "Secret Key" : "Password"}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="url">
                  {formData.type === VaultItemType.API_KEY ? "API Endpoint / URL" : "Website URL"}
                </Label>
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessEntityId">Business Entity</Label>
                <Select
                  value={formData.businessEntityId?.toString() || "none"}
                  onValueChange={(value) => handleSelectChange("businessEntityId", value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {entitiesData?.entities.map((entity: BusinessEntity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toolId">Associated Tool</Label>
                <Select
                  value={formData.toolId?.toString() || "none"}
                  onValueChange={(value) => handleSelectChange("toolId", value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tool (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {toolsData?.tools.map((tool: Tool) => (
                      <SelectItem key={tool.id} value={tool.id.toString()}>
                        {tool.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g. work, finance, important"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorite"
                  checked={formData.favorite}
                  onCheckedChange={(checked) => handleCheckboxChange("favorite", checked as boolean)}
                />
                <Label htmlFor="favorite" className="cursor-pointer">
                  Mark as favorite
                </Label>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Vault Item</DialogTitle>
            <DialogDescription>
              Update the details of your vault item.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Item Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={VaultItemType.PASSWORD}>Password</SelectItem>
                    <SelectItem value={VaultItemType.API_KEY}>API Key</SelectItem>
                    <SelectItem value={VaultItemType.SECURE_NOTE}>Secure Note</SelectItem>
                    <SelectItem value={VaultItemType.CREDIT_CARD}>Credit Card</SelectItem>
                    <SelectItem value={VaultItemType.OTP}>OTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {(formData.type === VaultItemType.PASSWORD || 
                formData.type === VaultItemType.API_KEY) && (
                <div className="space-y-2">
                  <Label htmlFor="edit-username">
                    {formData.type === VaultItemType.API_KEY ? "Key ID / Name" : "Username / Email"}
                  </Label>
                  <Input
                    id="edit-username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              {(formData.type === VaultItemType.PASSWORD || 
                formData.type === VaultItemType.API_KEY || 
                formData.type === VaultItemType.OTP) && (
                <div className="space-y-2">
                  <Label htmlFor="edit-password">
                    {formData.type === VaultItemType.API_KEY ? "API Key / Secret" : 
                      formData.type === VaultItemType.OTP ? "Secret Key" : "Password"}
                  </Label>
                  <Input
                    id="edit-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="edit-url">
                  {formData.type === VaultItemType.API_KEY ? "API Endpoint / URL" : "Website URL"}
                </Label>
                <Input
                  id="edit-url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-businessEntityId">Business Entity</Label>
                <Select
                  value={formData.businessEntityId?.toString() || "none"}
                  onValueChange={(value) => handleSelectChange("businessEntityId", value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {entitiesData?.entities.map((entity: BusinessEntity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-toolId">Associated Tool</Label>
                <Select
                  value={formData.toolId?.toString() || "none"}
                  onValueChange={(value) => handleSelectChange("toolId", value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tool (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {toolsData?.tools.map((tool: Tool) => (
                      <SelectItem key={tool.id} value={tool.id.toString()}>
                        {tool.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g. work, finance, important"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-favorite"
                  checked={formData.favorite}
                  onCheckedChange={(checked) => handleCheckboxChange("favorite", checked as boolean)}
                />
                <Label htmlFor="edit-favorite" className="cursor-pointer">
                  Mark as favorite
                </Label>
              </div>
            </div>
            <DialogFooter className="mt-4 flex items-center justify-between">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}