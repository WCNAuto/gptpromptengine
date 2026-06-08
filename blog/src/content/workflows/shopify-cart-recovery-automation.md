---
title: "n8n Automation for Shopify Abandoned Cart Recovery in 2026"
description: "Copy-paste n8n workflow to automatically send 3-email abandoned cart sequences via Klaviyo when customers leave items in Shopify carts."
profession: "Ecommerce"
category: "Recovery"
contentType: workflow
tags: ["n8n automation for shopify abandoned cart recovery", "shopify abandoned cart workflow", "automated email recovery sequence", "klaviyo shopify integration", "ecommerce cart abandonment automation"]
pubDate: 2026-06-08
featured: false
---

This workflow automatically triggers a 3-email recovery sequence when a customer abandons their Shopify cart, sending personalized emails through Klaviyo at 1 hour, 24 hours, and 72 hours after abandonment. It eliminates the manual task of monitoring abandoned carts and saves approximately 2 hours of daily email campaign management.

## Why this automation matters

Without this automation, you manually check abandoned carts daily, export customer lists, and schedule recovery emails in batches. This creates a 12-24 hour delay before the first recovery email reaches customers, reducing conversion rates by 15-30%. The workflow catches abandonment within minutes and delivers timely, personalized recovery emails that recover 8-12% of abandoned carts automatically.

## What you need before starting

- Shopify webhook credential with access to your store's checkout events
- Klaviyo API credential with list management and email sending permissions
- A Klaviyo email template set up for abandoned cart recovery with product image and cart total variables
- Your Shopify store's abandoned cart webhook configured to send to n8n webhook URL
- Klaviyo list ID where abandoned cart customers should be added

## How to build it: step by step

### 1. Webhook — Catch Shopify abandoned cart events

Node type: Webhook
HTTP Method: POST
Path: /shopify-abandoned-cart
Response Mode: Respond Immediately
Response Code: 200

This node receives webhook data from Shopify whenever a customer abandons their cart. Shopify sends customer email, cart items, total value, and abandonment timestamp. Configure your Shopify webhook to point to this n8n webhook URL.

### 2. Code — Extract and format cart data

Node type: Code
Mode: Run Once for All Items
JavaScript Code: Extract customer email, cart items array, cart total, and format product names into a readable list

This node parses the Shopify webhook payload and creates clean variables for the email sequence. It outputs structured data including customer_email, cart_total, product_list, and abandonment_time that Klaviyo can use in email templates.

### 3. Klaviyo — Add customer to abandoned cart list

Node type: Klaviyo
Operation: Add Profile to List
List ID: Your abandoned cart recovery list ID
Email: {{$node["Code"].json["customer_email"]}}
Properties: cart_total, product_list, abandonment_time

This adds the customer to your Klaviyo abandoned cart segment with custom properties. The properties populate dynamic content in your recovery email templates, ensuring each email shows the actual abandoned products and cart value.

### 4. Wait — Delay for first recovery email

Node type: Wait
Amount: 1
Unit: Hours

This creates the optimal delay before the first recovery email. One hour gives customers time to complete their purchase naturally while the cart contents are still fresh in their memory.

### 5. Klaviyo — Send first recovery email

Node type: Klaviyo
Operation: Send Email
Template ID: Your abandoned cart template 1 ID
Recipient: {{$node["Code"].json["customer_email"]}}
Context: cart_total, product_list

This sends the first recovery email with a gentle reminder and cart contents. The template should focus on convenience and include a direct link back to the cart with items preserved.

### 6. Wait — Delay for second recovery email

Node type: Wait
Amount: 23
Unit: Hours

This waits 23 additional hours (24 total from abandonment) before the second email. This timing catches customers who didn't see the first email or needed more consideration time.

### 7. Klaviyo — Send second recovery email with incentive

Node type: Klaviyo
Operation: Send Email
Template ID: Your abandoned cart template 2 ID
Recipient: {{$node["Code"].json["customer_email"]}}
Context: cart_total, product_list, discount_code

The second email includes a small discount or free shipping offer. This template should emphasize scarcity or limited-time offers to create urgency without appearing desperate.

### 8. Wait — Delay for final recovery email

Node type: Wait
Amount: 48
Unit: Hours

This waits 48 additional hours (72 total) for the final email. This catches customers who need longer decision time or were waiting for payday.

### 9. Klaviyo — Send final recovery email

Node type: Klaviyo
Operation: Send Email
Template ID: Your abandoned cart template 3 ID
Recipient: {{$node["Code"].json["customer_email"]}}
Context: cart_total, product_list

The final email focuses on social proof, reviews, or a last-chance message. Keep it brief and include alternative product suggestions in case the original cart items are no longer appealing.

## Full workflow JSON

```json
{
  "name": "Shopify Abandoned Cart Recovery",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "shopify-abandoned-cart",
        "responseMode": "respondImmediately",
        "responseCode": 200
      },
      "id": "webhook-shopify",
      "name": "Shopify Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const items = [];\n\nfor (const item of $input.all()) {\n  const data = item.json;\n  \n  // Extract cart data from Shopify webhook\n  const customerEmail = data.email;\n  const cartTotal = data.total_price;\n  const lineItems = data.line_items || [];\n  \n  // Format product list for email\n  const productList = lineItems.map(item => \n    `${item.title} - $${item.price} (Qty: ${item.quantity})`\n  ).join(', ');\n  \n  items.push({\n    customer_email: customerEmail,\n    cart_total: cartTotal,\n    product_list: productList,\n    abandonment_time: new Date().toISOString(),\n    cart_url: data.abandoned_checkout_url\n  });\n}\n\nreturn items;"
      },
      "id": "code-extract",
      "name": "Extract Cart Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "operation": "addProfileToList",
        "listId": "YOUR_ABANDONED_CART_LIST_ID",
        "email": "={{$node['Extract Cart Data'].json['customer_email']}}",
        "additionalFields": {
          "properties": {
            "cart_total": "={{$node['Extract Cart Data'].json['cart_total']}}",
            "product_list": "={{$node['Extract Cart Data'].json['product_list']}}",
            "abandonment_time": "={{$node['Extract Cart Data'].json['abandonment_time']}}"
          }
        }
      },
      "id": "klaviyo-add",
      "name": "Add to Klaviyo List",
      "type": "n8n-nodes-base.klaviyo",
      "typeVersion": 1,
      "position": [680, 300],
      "credentials": {
        "klaviyoApi": {
          "id": "YOUR_KLAVIYO_CREDENTIAL_ID",
          "name": "Klaviyo API"
        }
      }
    },
    {
      "parameters": {
        "amount": 1,
        "unit": "hours"
      },
      "id": "wait-1hour",
      "name": "Wait 1 Hour",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "operation": "sendEmail",
        "templateId": "YOUR_TEMPLATE_1_ID",
        "fromEmail": "no-reply@yourstore.com",
        "fromName": "Your Store Name",
        "subject": "You left something in your cart",
        "toEmail": "={{$node['Extract Cart Data'].json['customer_email']}}",
        "additionalFields": {
          "context": {
            "cart_total": "={{$node['Extract Cart Data'].json['cart_total']}}",
            "product_list": "={{$node['Extract Cart Data'].json['product_list']}}",
            "cart_url": "={{$node['Extract Cart Data'].json['cart_url']}}"
          }
        }
      },
      "id": "klaviyo-email1",
      "name": "Send First Email",
      "type": "n8n-nodes-base.klaviyo",
      "typeVersion": 1,
      "position": [1120, 300],
      "credentials": {
        "klaviyoApi": {
          "id": "YOUR_KLAVIYO_CREDENTIAL_ID",
          "name": "Klaviyo API"
        }
      }
    },
    {
      "parameters": {
        "amount": 23,
        "unit": "hours"
      },
      "id": "wait-24hours",
      "name": "Wait 23 More Hours",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [1340, 300]
    },
    {
      "parameters": {
        "operation": "sendEmail",
        "templateId": "YOUR_TEMPLATE_2_ID",
        "fromEmail": "no-reply@yourstore.com",
        "fromName": "Your Store Name",
        "subject": "Still interested? Here's 10% off",
        "toEmail": "={{$node['Extract Cart Data'].json['customer_email']}}",
        "additionalFields": {
          "context": {
            "cart_total": "={{$node['Extract Cart Data'].json['cart_total']}}",
            "product_list": "={{$node['Extract Cart Data'].json['product_list']}}",
            "cart_url": "={{$node['Extract Cart Data'].json['cart_url']}}",
            "discount_code": "SAVE10"
          }
        }
      },
      "id": "klaviyo-email2",
      "name": "Send Second Email",
      "type": "n8n-nodes-base.klaviyo",
      "typeVersion": 1,
      "position": [1560, 300],
      "credentials": {
        "klaviyoApi": {
          "id": "YOUR_KLAVIYO_CREDENTIAL_ID",
          "name": "Klaviyo API"
        }
      }
    },
    {
      "parameters": {
        "amount": 48,
        "unit": "hours"
      },
      "id": "wait-72hours",
      "name": "Wait 48 More Hours",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [1780, 300]
    },
    {
      "parameters": {
        "operation": "sendEmail",
        "templateId": "YOUR_TEMPLATE_3_ID",
        "fromEmail": "no-reply@yourstore.com",
        "fromName": "Your Store Name",
        "subject": "Last chance - your cart expires soon",
        "toEmail": "={{$node['Extract Cart Data'].json['customer_email']}}",
        "additionalFields": {
          "context": {
            "cart_total": "={{$node['Extract Cart Data'].json['cart_total']