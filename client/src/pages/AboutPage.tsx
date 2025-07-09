import React from "react";
import { Button } from "@/components/ui/button";
import SaasLayout from "@/components/SaasLayout";
import { Building, Users, Award, Globe, Zap, Heart, BarChart, Target, Percent, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const teamMembers = [
  {
    name: "Alex Richardson",
    role: "Founder & CEO",
    image: "/assets/team/alex.jpg",
    bio: "Former CMO at TechGiant with 15+ years of digital marketing expertise.",
    social: {
      linkedin: "https://linkedin.com/in/alexrichardson",
      twitter: "https://twitter.com/alexrichardson"
    }
  },
  {
    name: "Sophia Chen",
    role: "Chief Technology Officer",
    image: "/assets/team/sophia.jpg",
    bio: "Ex-Google engineer with expertise in AI and automation systems.",
    social: {
      linkedin: "https://linkedin.com/in/sophiachen",
      twitter: "https://twitter.com/sophiachen"
    }
  },
  {
    name: "Marcus Johnson",
    role: "Head of Customer Success",
    image: "/assets/team/marcus.jpg",
    bio: "Customer experience specialist with background in SaaS platforms.",
    social: {
      linkedin: "https://linkedin.com/in/marcusjohnson",
      twitter: "https://twitter.com/marcusjohnson"
    }
  },
  {
    name: "Olivia Williams",
    role: "Head of Product",
    image: "/assets/team/olivia.jpg",
    bio: "Product leader with expertise in UX design and customer-centric development.",
    social: {
      linkedin: "https://linkedin.com/in/oliviawilliams",
      twitter: "https://twitter.com/oliviawilliams"
    }
  },
  {
    name: "David Kim",
    role: "VP of Marketing",
    image: "/assets/team/david.jpg",
    bio: "Digital marketing strategist with focus on growth and acquisition.",
    social: {
      linkedin: "https://linkedin.com/in/davidkim",
      twitter: "https://twitter.com/davidkim"
    }
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Sales",
    image: "/assets/team/elena.jpg",
    bio: "Enterprise sales leader with 10+ years in B2B SaaS platforms.",
    social: {
      linkedin: "https://linkedin.com/in/elenarodriguez",
      twitter: "https://twitter.com/elenarodriguez"
    }
  }
];

const values = [
  {
    title: "Customer Obsession",
    description: "We're dedicated to understanding and solving our customers' challenges above all else.",
    icon: <Heart className="h-10 w-10 text-primary" />
  },
  {
    title: "Relentless Innovation",
    description: "We continuously push boundaries to create better solutions and experiences.",
    icon: <Zap className="h-10 w-10 text-primary" />
  },
  {
    title: "Data-Driven Decisions",
    description: "We let metrics and analytics guide our strategies and improvements.",
    icon: <BarChart className="h-10 w-10 text-primary" />
  },
  {
    title: "Operational Excellence",
    description: "We strive for efficiency and precision in everything we build.",
    icon: <CheckCircle2 className="h-10 w-10 text-primary" />
  },
  {
    title: "Results Orientation",
    description: "We focus on measurable outcomes that deliver real business value.",
    icon: <Target className="h-10 w-10 text-primary" />
  },
  {
    title: "Continuous Growth",
    description: "We're committed to learning, adapting, and evolving our capabilities.",
    icon: <Percent className="h-10 w-10 text-primary" />
  }
];

export default function AboutPage() {
  return (
    <SaasLayout>
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring bg-primary/10 text-primary mb-4">
                About DMPHQ
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Powering Business Execution Excellence</h1>
              <p className="text-xl text-muted-foreground">
                DMPHQ is a comprehensive business execution platform designed to help organizations streamline operations, enhance collaboration, and drive measurable results through AI-powered intelligence.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <Button size="lg">Meet The Team</Button>
                <Button size="lg" variant="outline">Our Mission</Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute inset-8 flex items-center justify-center">
                  <Building className="h-36 w-36 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="bg-card rounded-xl p-8 border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block p-3 rounded-lg bg-primary/10 mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                At DMPHQ, our mission is to empower businesses with intuitive tools and AI-driven insights that streamline operations, enhance cross-functional collaboration, and drive measurable growth. We're committed to making sophisticated business execution accessible to organizations of all sizes.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-xl p-8 border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-block p-3 rounded-lg bg-primary/10 mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                We envision a future where every organization can operate with the efficiency and insight of enterprise-grade systems, regardless of their size or resources. By democratizing access to powerful business execution tools, we aim to unlock growth potential for businesses worldwide.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">DMPHQ By The Numbers</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform's impact continues to grow as we help businesses transform their operations and achieve more.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "10,000+", description: "Professionals using DMPHQ daily" },
              { label: "Business Processes", value: "50,000+", description: "Automated and optimized" },
              { label: "Customer Satisfaction", value: "98%", description: "Would recommend DMPHQ" },
              { label: "Time Saved", value: "15+ hours", description: "Per week per user average" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-card rounded-xl p-8 border text-center shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Company Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide our decisions, shape our culture, and drive our commitment to excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="bg-card rounded-xl p-8 border shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="inline-block p-3 rounded-lg bg-primary/10 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring bg-primary/10 text-primary mb-4">
              Our Leadership
            </div>
            <h2 className="text-3xl font-bold mb-4">Meet the Team Behind DMPHQ</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our diverse and experienced team is united by a passion for building tools that make businesses more effective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-card rounded-xl p-6 border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Answers to common questions about DMPHQ and our approach to business execution.
            </p>
          </div>

          <Tabs defaultValue="company" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">When was DMPHQ founded?</h3>
                  <p className="text-muted-foreground">
                    DMPHQ was founded in 2021 by a team of business operations experts and technology innovators who recognized the need for more integrated and intelligent business execution tools.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Where is DMPHQ headquartered?</h3>
                  <p className="text-muted-foreground">
                    Our company is headquartered in Austin, Texas with additional offices in San Francisco, New York, and London to serve our global customer base.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Is DMPHQ hiring?</h3>
                  <p className="text-muted-foreground">
                    Yes! We're always looking for talented individuals to join our team. Visit our Careers page to see current openings and submit your application.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="product" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">What makes DMPHQ different from other platforms?</h3>
                  <p className="text-muted-foreground">
                    DMPHQ uniquely combines operational tools, strategic insights, and AI-powered optimization in a single platform. Our solution integrates across functions rather than creating more silos.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Is DMPHQ suitable for small businesses?</h3>
                  <p className="text-muted-foreground">
                    Absolutely. We've designed DMPHQ to scale with your business. Our flexible pricing and modular approach allow companies of all sizes to access enterprise-grade capabilities.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Does DMPHQ integrate with other tools?</h3>
                  <p className="text-muted-foreground">
                    Yes, we offer extensive integration capabilities with popular business tools including CRM systems, marketing platforms, accounting software, and project management solutions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">How can I get help with DMPHQ?</h3>
                  <p className="text-muted-foreground">
                    We offer multiple support channels including a comprehensive knowledge base, community forums, email support, and priority phone support for Enterprise customers.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Do you offer training for new users?</h3>
                  <p className="text-muted-foreground">
                    Yes, we provide interactive onboarding, video tutorials, regular webinars, and custom training sessions for teams. Enterprise plans include dedicated onboarding specialists.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">What is your SLA for support response?</h3>
                  <p className="text-muted-foreground">
                    Our standard support SLA is a response within 24 hours, while Premium and Enterprise customers receive responses within 4 hours during business hours and emergency support 24/7.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl bg-primary/5 border p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your business operations?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses that use DMPHQ to streamline operations, enhance collaboration, and drive measurable growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg">Schedule a Demo</Button>
              <Button size="lg" variant="outline">View Pricing</Button>
            </div>
          </div>
        </section>
      </div>
    </SaasLayout>
  );
}