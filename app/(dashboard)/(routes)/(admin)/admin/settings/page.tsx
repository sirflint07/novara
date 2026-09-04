"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Lock,
  Mail,
  Palette,
  Save,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const initialSettings = {
  platform: {
    name: "Novara",
    description: "Learn from the best",
    logo: "/logo.svg",
    favicon: "/favicon.ico",
  },
  branding: {
    primaryColor: "#4F46E5",
    secondaryColor: "#7C3AED",
    accentColor: "#10B981",
  },
  features: {
    maintenanceMode: false,
    allowRegistration: true,
    allowInstructorSignup: true,
    requireEmailVerification: true,
  },
  courses: {
    defaultPrice: 49.99,
    maxFileSize: 100, // MB
    allowFreeCourses: true,
  },
  email: {
    senderEmail: "noreply@novara.com",
    senderName: "Novara Team",
  },
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(initialSettings);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      // await axios.patch('/api/admin/settings', settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500">Manage platform settings and preferences</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">General Settings</CardTitle>
              <CardDescription>Basic platform information and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Platform Name</Label>
                <Input
                  id="site-name"
                  value={settings.platform.name}
                  onChange={(e) => updateSetting("platform", "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Platform Description</Label>
                <Input
                  id="site-description"
                  value={settings.platform.description}
                  onChange={(e) => updateSetting("platform", "description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={settings.platform.logo}
                    onChange={(e) => updateSetting("platform", "logo", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={settings.platform.favicon}
                    onChange={(e) => updateSetting("platform", "favicon", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Branding Settings</CardTitle>
              <CardDescription>Customize the look and feel of your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-10 w-10 rounded-md border border-gray-200"
                      style={{ backgroundColor: settings.branding.primaryColor }}
                    />
                    <Input
                      id="primary-color"
                      type="color"
                      value={settings.branding.primaryColor}
                      onChange={(e) => updateSetting("branding", "primaryColor", e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-10 w-10 rounded-md border border-gray-200"
                      style={{ backgroundColor: settings.branding.secondaryColor }}
                    />
                    <Input
                      id="secondary-color"
                      type="color"
                      value={settings.branding.secondaryColor}
                      onChange={(e) => updateSetting("branding", "secondaryColor", e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-10 w-10 rounded-md border border-gray-200"
                      style={{ backgroundColor: settings.branding.accentColor }}
                    />
                    <Input
                      id="accent-color"
                      type="color"
                      value={settings.branding.accentColor}
                      onChange={(e) => updateSetting("branding", "accentColor", e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Preview</p>
                <div className="flex items-center gap-3 mt-2">
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: settings.branding.primaryColor }}
                  />
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: settings.branding.secondaryColor }}
                  />
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: settings.branding.accentColor }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feature Settings</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Put the platform in maintenance mode</p>
                  </div>
                  <Switch
                    checked={settings.features.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting("features", "maintenanceMode", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Allow Registration</p>
                    <p className="text-sm text-gray-500">Allow new users to sign up</p>
                  </div>
                  <Switch
                    checked={settings.features.allowRegistration}
                    onCheckedChange={(checked) => updateSetting("features", "allowRegistration", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Instructor Signup</p>
                    <p className="text-sm text-gray-500">Allow users to become instructors</p>
                  </div>
                  <Switch
                    checked={settings.features.allowInstructorSignup}
                    onCheckedChange={(checked) => updateSetting("features", "allowInstructorSignup", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Verification</p>
                    <p className="text-sm text-gray-500">Require email verification for new users</p>
                  </div>
                  <Switch
                    checked={settings.features.requireEmailVerification}
                    onCheckedChange={(checked) => updateSetting("features", "requireEmailVerification", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Settings</CardTitle>
              <CardDescription>Configure course defaults and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-price">Default Course Price ($)</Label>
                <Input
                  id="default-price"
                  type="number"
                  step="0.01"
                  value={settings.courses.defaultPrice}
                  onChange={(e) => updateSetting("courses", "defaultPrice", parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                <Input
                  id="max-file-size"
                  type="number"
                  value={settings.courses.maxFileSize}
                  onChange={(e) => updateSetting("courses", "maxFileSize", parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Allow Free Courses</p>
                  <p className="text-sm text-gray-500">Allow instructors to create free courses</p>
                </div>
                <Switch
                  checked={settings.courses.allowFreeCourses}
                  onCheckedChange={(checked) => updateSetting("courses", "allowFreeCourses", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Settings</CardTitle>
              <CardDescription>Configure email notifications and templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sender-email">Sender Email</Label>
                <Input
                  id="sender-email"
                  type="email"
                  value={settings.email.senderEmail}
                  onChange={(e) => updateSetting("email", "senderEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-name">Sender Name</Label>
                <Input
                  id="sender-name"
                  value={settings.email.senderName}
                  onChange={(e) => updateSetting("email", "senderName", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}