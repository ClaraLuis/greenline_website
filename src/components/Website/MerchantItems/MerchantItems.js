import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { Modal } from 'react-bootstrap';
import { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import API from '../../../API/API.js';
import Inputfield from '../../Inputfield.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import MerchantSelect from '../MerchantHome/MerchantSelect.js';
import ItemsTable from './ItemsTable.js';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';

const { ValueContainer, Placeholder } = components;

const MerchantItems = (props) => {
    const content = `
 <html>

<head>
<meta http-equiv=Content-Type content="text/html; charset=windows-1252">
<meta name=Generator content="Microsoft Word 15 (filtered)">
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
	{font-family:"Roboto Mono";}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0in;
	line-height:115%;
	font-size:11.0pt;
	font-family:"Arial",sans-serif;}
h3
	{margin-top:16.0pt;
	margin-right:0in;
	margin-bottom:4.0pt;
	margin-left:0in;
	line-height:115%;
	page-break-after:avoid;
	font-size:14.0pt;
	font-family:"Arial",sans-serif;
	color:#434343;
	font-weight:normal;}
h4
	{margin-top:14.0pt;
	margin-right:0in;
	margin-bottom:4.0pt;
	margin-left:0in;
	line-height:115%;
	page-break-after:avoid;
	font-size:12.0pt;
	font-family:"Arial",sans-serif;
	color:#666666;
	font-weight:normal;}
.MsoChpDefault
	{font-family:"Arial",sans-serif;}
.MsoPapDefault
	{line-height:115%;}
@page WordSection1
	{size:8.5in 11.0in;
	margin:1.0in 1.0in 1.0in 1.0in;}
div.WordSection1
	{page:WordSection1;}
 /* List Definitions */
 ol
	{margin-bottom:0in;}
ul
	{margin-bottom:0in;}
-->
</style>

</head>

<body lang=EN-US style='word-wrap:break-word'>

<div class=WordSection1>

<h3 style='margin-top:14.0pt;page-break-after:auto'><a name="_j4g7v1l8i7xy"></a><b><span
lang=EN style='font-size:13.0pt;line-height:115%;color:black'>Documentation for
Product and Variant Input Template</span></b></h3>

<h4 style='margin-top:12.0pt;margin-right:0in;margin-bottom:2.0pt;margin-left:
0in;page-break-after:auto'><a name="_kv6hf3kcj7w9"></a><b><span lang=EN
style='font-size:11.0pt;line-height:115%;color:black'>Overview</span></b></h4>

<p class=MsoNormal style='margin-top:12.0pt;margin-right:0in;margin-bottom:
12.0pt;margin-left:0in'><span lang=EN>This Excel sheet template is designed to
allow merchants to input data for products and their associated variants in a
single, unified format. The template includes columns for basic product
information, variant details, and options like color or size. Below is a
detailed explanation of each column in the template and instructions on how to
fill it out.</span></p>

<h4 style='margin-top:12.0pt;margin-right:0in;margin-bottom:2.0pt;margin-left:
0in;page-break-after:auto'><a name="_jhlgv5ou3eku"></a><b><span lang=EN
style='font-size:11.0pt;line-height:115%;color:black'>Column Descriptions and
Instructions</span></b></h4>

<ol style='margin-top:0in' start=1 type=1>
 <li class=MsoNormal style='margin-top:12.0pt'><b><span lang=EN
     style='font-family:"Roboto Mono";color:#188038'>id</span></b><span
     lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>This is the unique identifier for each product. It
helps group all variants under a single product.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Use a unique integer ID for each product (e.g., </span><span
lang=EN style='font-family:"Roboto Mono";color:#188038'>1</span><span lang=EN>,
</span><span lang=EN style='font-family:"Roboto Mono";color:#188038'>2</span><span
lang=EN>, </span><span lang=EN style='font-family:"Roboto Mono";color:#188038'>3</span><span
lang=EN>).</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Keep the </span><span lang=EN style='font-family:
"Roboto Mono";color:#188038'>id</span><span lang=EN> consistent for all rows
that belong to the same product (e.g., all &quot;Shirt&quot; variants should
have </span><span lang=EN style='font-family:"Roboto Mono";color:#188038'>id</span><span
lang=EN> </span><span lang=EN style='font-family:"Roboto Mono";color:#188038'>1</span><span
lang=EN>).</span></p>

<ol style='margin-top:0in' start=2 type=1>
 <li class=MsoNormal><b><span lang=EN style='font-family:"Roboto Mono";
     color:#188038'>product_name</span></b><span lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>The name of the product.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Enter the primary name of the product (e.g.,
&quot;Shirt&quot;, &quot;Pants&quot;).</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Only enter this value in the first row for a
specific product. Leave it blank for subsequent rows of the same product.</span></p>

<ol style='margin-top:0in' start=3 type=1>
 <li class=MsoNormal><b><span lang=EN style='font-family:"Roboto Mono";
     color:#188038'>product_description</span></b><span lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>A brief description of the product.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Provide a concise description (e.g., &quot;Good
quality shirt&quot;, &quot;Jeans pants&quot;).</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Enter the description only once for each product;
subsequent rows can be left blank.</span></p>

<ol style='margin-top:0in' start=4 type=1>
 <li class=MsoNormal><b><span lang=EN style='font-family:"Roboto Mono";
     color:#188038'>product_sku</span></b><span lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Stock Keeping Unit (SKU) for the main product.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Enter the SKU that represents the main product.
This will be the same for all variants of that product.</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Input it only in the first row for a product
group.</span></p>

<ol style='margin-top:0in' start=5 type=1>
 <li class=MsoNormal><b><span lang=EN style='font-family:"Roboto Mono";
     color:#188038'>default_price</span></b><span lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>The base or default price of the product.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Enter the default price (e.g., </span><span
lang=EN style='font-family:"Roboto Mono";color:#188038'>27.5</span><span
lang=EN>).</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Input it only once in the first row for each
product group.</span></p>

<ol style='margin-top:0in' start=6 type=1>
 <li class=MsoNormal><b><span lang=EN style='font-family:"Roboto Mono";
     color:#188038'>variant_name</span></b><span lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>A comma-separated list of variant types associated
with the product.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>List the names of the variant types (e.g., </span><span
lang=EN style='font-family:"Roboto Mono";color:#188038'>Color,Size,Texture</span><span
lang=EN>).</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Ensure that these variants are listed in a
consistent order across all rows for the same product.</span></p>

<ol style='margin-top:0in' start=7 type=1>
 <li class=MsoNormal><b><span lang=EN style='font-family:"Roboto Mono";
     color:#188038'>variant_option</span></b><span lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>A comma-separated list of options corresponding to
each variant type.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Provide the specific options for each variant type
in the same order as listed in </span><span lang=EN style='font-family:"Roboto Mono";
color:#188038'>variant_name</span><span lang=EN> (e.g., </span><span lang=EN
style='font-family:"Roboto Mono";color:#188038'>red,large,leather</span><span
lang=EN>).</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Each option represents a different variation of
the product.</span></p>

<ol style='margin-top:0in' start=8 type=1>
 <li class=MsoNormal><b><span lang=EN style='font-family:"Roboto Mono";
     color:#188038'>variant_option_hex</span></b><span lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>A comma-separated list of hexadecimal color codes
for variants that require color representation.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>If a variant involves color, provide the color
code in hexadecimal (e.g., </span><span lang=EN style='font-family:"Roboto Mono";
color:#188038'>FF0000</span><span lang=EN> for red).</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>If not applicable, leave the corresponding entry
blank.</span></p>

<ol style='margin-top:0in' start=9 type=1>
 <li class=MsoNormal><b><span lang=EN style='font-family:"Roboto Mono";
     color:#188038'>variant_sku</span></b><span lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>SKU for each specific variant of the product.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Enter a unique SKU for each variant (e.g., </span><span
lang=EN style='font-family:"Roboto Mono";color:#188038'>RED-L-TH-SHIRT_23</span><span
lang=EN>).</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Ensure each variant has a distinct SKU that
identifies it uniquely.</span></p>

<ol style='margin-top:0in' start=10 type=1>
 <li class=MsoNormal><b><span lang=EN style='font-family:"Roboto Mono";
     color:#188038'>variant_price</span></b><span lang=EN>:</span></li>
</ol>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Price for each specific variant of the product.</span></p>

<p class=MsoNormal style='margin-left:1.0in;text-indent:-.25in'><span lang=EN>&#9675;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><b><span lang=EN>Instructions</span></b><span lang=EN>:</span></p>

<p class=MsoNormal style='margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Enter the price if it differs from the default
price.</span></p>

<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:12.0pt;
margin-left:1.5in;text-indent:-.25in'><span lang=EN>&#9632;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>If the variant price is the same as the default
price, it can be left blank.</span></p>

<h4 style='margin-top:12.0pt;margin-right:0in;margin-bottom:2.0pt;margin-left:
0in;page-break-after:auto'><a name="_1azbe0c340pj"></a><b><span lang=EN
style='font-size:11.0pt;line-height:115%;color:black'>Example Data</span></b></h4>

<p class=MsoNormal style='margin-top:12.0pt;margin-right:0in;margin-bottom:
12.0pt;margin-left:0in'><span lang=EN>Below is an example to illustrate how the
data should be filled out:</span></p>

<table class=a border=1 cellspacing=0 cellpadding=0 width=624 style='border-collapse:
 collapse;border:none'>
 <tr style='height:25.75pt'>
  <td width=15 valign=top style='width:11.35pt;border:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>id</span></b></p>
  </td>
  <td width=61 valign=top style='width:45.9pt;border:solid black 1.0pt;
  border-left:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>product_name</span></b></p>
  </td>
  <td width=82 valign=top style='width:61.55pt;border:solid black 1.0pt;
  border-left:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>product_description</span></b></p>
  </td>
  <td width=54 valign=top style='width:40.65pt;border:solid black 1.0pt;
  border-left:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>product_sku</span></b></p>
  </td>
  <td width=57 valign=top style='width:42.7pt;border:solid black 1.0pt;
  border-left:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>default_price</span></b></p>
  </td>
  <td width=72 valign=top style='width:54.35pt;border:solid black 1.0pt;
  border-left:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>variant_name</span></b></p>
  </td>
  <td width=75 valign=top style='width:55.95pt;border:solid black 1.0pt;
  border-left:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>variant_option</span></b></p>
  </td>
  <td width=79 valign=top style='width:59.55pt;border:solid black 1.0pt;
  border-left:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>variant_option_hex</span></b></p>
  </td>
  <td width=70 valign=top style='width:52.7pt;border:solid black 1.0pt;
  border-left:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>variant_sku</span></b></p>
  </td>
  <td width=57 valign=top style='width:43.1pt;border:solid black 1.0pt;
  border-left:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN>variant_price</span></b></p>
  </td>
 </tr>
 <tr style='height:39.25pt'>
  <td width=15 valign=top style='width:11.35pt;border:solid black 1.0pt;
  border-top:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>1</span></p>
  </td>
  <td width=61 valign=top style='width:45.9pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>Shirt</span></p>
  </td>
  <td width=82 valign=top style='width:61.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>Good quality shirt</span></p>
  </td>
  <td width=54 valign=top style='width:40.65pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>primary_sku</span></p>
  </td>
  <td width=57 valign=top style='width:42.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>27.5</span></p>
  </td>
  <td width=72 valign=top style='width:54.35pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>Color,Size,Texture</span></p>
  </td>
  <td width=75 valign=top style='width:55.95pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>red,large,leather</span></p>
  </td>
  <td width=79 valign=top style='width:59.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>FF0000,,FF00FF</span></p>
  </td>
  <td width=70 valign=top style='width:52.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>RED-L-TH-SHIRT_23</span></p>
  </td>
  <td width=57 valign=top style='width:43.1pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>22.2</span></p>
  </td>
 </tr>
 <tr style='height:39.25pt'>
  <td width=15 valign=top style='width:11.35pt;border:solid black 1.0pt;
  border-top:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>1</span></p>
  </td>
  <td width=61 valign=top style='width:45.9pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=82 valign=top style='width:61.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=54 valign=top style='width:40.65pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=57 valign=top style='width:42.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=72 valign=top style='width:54.35pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>Color,Size,Texture</span></p>
  </td>
  <td width=75 valign=top style='width:55.95pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>red,medium,leather</span></p>
  </td>
  <td width=79 valign=top style='width:59.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>FF0000,,FF00FF</span></p>
  </td>
  <td width=70 valign=top style='width:52.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>RED-M-TH-SHIRT_28</span></p>
  </td>
  <td width=57 valign=top style='width:43.1pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
 </tr>
 <tr style='height:39.25pt'>
  <td width=15 valign=top style='width:11.35pt;border:solid black 1.0pt;
  border-top:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>1</span></p>
  </td>
  <td width=61 valign=top style='width:45.9pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=82 valign=top style='width:61.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=54 valign=top style='width:40.65pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=57 valign=top style='width:42.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=72 valign=top style='width:54.35pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>Color,Size,Texture</span></p>
  </td>
  <td width=75 valign=top style='width:55.95pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>red,small,leather</span></p>
  </td>
  <td width=79 valign=top style='width:59.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:39.25pt'>
  <p class=MsoNormal><span lang=EN>FF0000,,FF00FF</span></p>
  </td>
  <td width=70 valign=top style='width:52.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>RED-S-TH-SHIRT_24</span></p>
  </td>
  <td width=57 valign=top style='width:43.1pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:39.25pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
 </tr>
 <tr style='height:25.75pt'>
  <td width=15 valign=top style='width:11.35pt;border:solid black 1.0pt;
  border-top:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>2</span></p>
  </td>
  <td width=61 valign=top style='width:45.9pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>Pants</span></p>
  </td>
  <td width=82 valign=top style='width:61.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>Jeans pants</span></p>
  </td>
  <td width=54 valign=top style='width:40.65pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>primary_sku</span></p>
  </td>
  <td width=57 valign=top style='width:42.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>105</span></p>
  </td>
  <td width=72 valign=top style='width:54.35pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>Color,Size</span></p>
  </td>
  <td width=75 valign=top style='width:55.95pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>blue,large</span></p>
  </td>
  <td width=79 valign=top style='width:59.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=70 valign=top style='width:52.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>BLUE_JEANS_L</span></p>
  </td>
  <td width=57 valign=top style='width:43.1pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>150</span></p>
  </td>
 </tr>
 <tr style='height:25.75pt'>
  <td width=15 valign=top style='width:11.35pt;border:solid black 1.0pt;
  border-top:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>2</span></p>
  </td>
  <td width=61 valign=top style='width:45.9pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=82 valign=top style='width:61.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=54 valign=top style='width:40.65pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=57 valign=top style='width:42.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=72 valign=top style='width:54.35pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>Color,Size</span></p>
  </td>
  <td width=75 valign=top style='width:55.95pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>black,large</span></p>
  </td>
  <td width=79 valign=top style='width:59.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>FFFFFF</span></p>
  </td>
  <td width=70 valign=top style='width:52.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>BLK_JEANS_L</span></p>
  </td>
  <td width=57 valign=top style='width:43.1pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
 </tr>
 <tr style='height:25.75pt'>
  <td width=15 valign=top style='width:11.35pt;border:solid black 1.0pt;
  border-top:none;padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>2</span></p>
  </td>
  <td width=61 valign=top style='width:45.9pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=82 valign=top style='width:61.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=54 valign=top style='width:40.65pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=57 valign=top style='width:42.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=72 valign=top style='width:54.35pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>Color,Size</span></p>
  </td>
  <td width=75 valign=top style='width:55.95pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>grey,large</span></p>
  </td>
  <td width=79 valign=top style='width:59.55pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:25.75pt'>
  <p class=MsoNormal><span lang=EN>&nbsp;</span></p>
  </td>
  <td width=70 valign=top style='width:52.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>GREY_JNZ_L</span></p>
  </td>
  <td width=57 valign=top style='width:43.1pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:25.75pt'>
  <p class=MsoNormal><span lang=EN>70</span></p>
  </td>
 </tr>
</table>

<h4 style='margin-top:12.0pt;margin-right:0in;margin-bottom:2.0pt;margin-left:
0in;page-break-after:auto'><a name="_1qevejtyhwgu"></a><b><span lang=EN
style='font-size:11.0pt;line-height:115%;color:black'>Important Notes:</span></b></h4>

<p class=MsoNormal style='margin-top:12.0pt;margin-right:0in;margin-bottom:
0in;margin-left:.5in;margin-bottom:.0001pt;text-indent:-.25in'><span lang=EN>&#9679;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Ensure that all variants for the same product have
the same </span><span lang=EN style='font-family:"Roboto Mono";color:#188038'>id</span><span
lang=EN>.</span></p>

<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=EN>&#9679;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>The </span><span lang=EN style='font-family:"Roboto Mono";
color:#188038'>variant_name</span><span lang=EN> should be consistent across
rows for the same product to ensure clarity.</span></p>

<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=EN>&#9679;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>The order of </span><span lang=EN
style='font-family:"Roboto Mono";color:#188038'>variant_option</span><span
lang=EN> values must match the order in </span><span lang=EN style='font-family:
"Roboto Mono";color:#188038'>variant_name</span><span lang=EN>.</span></p>

<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:12.0pt;
margin-left:.5in;text-indent:-.25in'><span lang=EN>&#9679;<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
dir=LTR></span><span lang=EN>Use proper formatting for SKUs and variant SKUs to
keep data consistent.</span></p>

<p class=MsoNormal><span lang=EN>&nbsp;</span></p>

</div>

</body>

</html>

  `;
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, setimportedDataContext, isAuth, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { fetchMerchantItems, useQueryGQL, useMutationNoInputGQL, uploadExcelFile, addCompoundItem, fetchMerchants } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const cookies = new Cookies();
    const [importModal, setimportModal] = useState(false);
    const [csvFile, setcsvFile] = useState(null);
    const [type, settype] = useState('additem');

    const [merchantModal, setmerchantModal] = useState(false);

    const [payload, setPayload] = useState({
        limit: 20,
        isAsc: false,
        afterCursor: '',
        beforeCursor: '',
        name: '',
        sku: '',
        merchantId: parseInt(cookies.get('merchantId')),
    });
    const fetchMerchantItemsQuery = useQueryGQL('', fetchMerchantItems(), payload);

    const { refetch: refetchItems } = useQueryGQL('', fetchMerchantItems(), payload);
    const [uploadExcelFileMutation] = useMutationNoInputGQL(uploadExcelFile(), { base64File: csvFile });
    useEffect(() => {
        setpageactive_context('/merchantitems');
        setpagetitle_context('Merchant');
        refetchItems();
    }, []);

    // const handleDownload = () => {
    //     // Prepare the data in row format
    //     const data = {
    //         uploadExcelFile: {
    //             result: [
    //                 {
    //                     productName: 'Shirt',
    //                     productDescription: 'Good quality shirt',
    //                     productSku: 'primary_sku',
    //                     defaultPrice: 27.5,
    //                     variantOptionAttributes: [
    //                         {
    //                             sku: 'RED-L-TH-SHIRT_23',
    //                             price: 22.2,
    //                             variantOptions: [{ value: 'red', colorHex: 'FF0000' }, { value: 'large' }, { value: 'leather', colorHex: 'FF00FF' }],
    //                         },
    //                         {
    //                             sku: 'RED-M-TH-SHIRT_28',
    //                             price: 27.5,
    //                             variantOptions: [{ value: 'red', colorHex: 'FF0000' }, { value: 'medium' }, { value: 'leather', colorHex: 'FF00FF' }],
    //                         },
    //                         {
    //                             sku: 'RED-S-TH-SHIRT_24',
    //                             price: 27.5,
    //                             variantOptions: [{ value: 'red', colorHex: 'FF0000' }, { value: 'small' }, { value: 'leather', colorHex: 'FF00FF' }],
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     productName: 'Pants',
    //                     productDescription: 'Jeans pants',
    //                     productSku: 'primary_sku',
    //                     defaultPrice: 105,
    //                     variantOptionAttributes: [
    //                         {
    //                             sku: 'BLUE_JEANS_L',
    //                             price: 150,
    //                             variantOptions: [{ value: 'blue' }, { value: 'large' }],
    //                         },
    //                         {
    //                             sku: 'BLK_JEANS_L',
    //                             price: 105,
    //                             variantOptions: [{ value: 'black', colorHex: 'FFFFFF' }, { value: 'large' }],
    //                         },
    //                         {
    //                             sku: 'GREY_JNZ_L',
    //                             price: 70,
    //                             variantOptions: [{ value: 'grey' }, { value: 'large' }],
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //     };

    //     const rows = [];
    //     data.uploadExcelFile.result.forEach((product, index) => {
    //         product.variantOptionAttributes.forEach((variant, variantIndex) => {
    //             const variantNames = product.variantOptionAttributes[0].variantOptions.map((option) => (option.colorHex ? option.value : option.value)).join(',');

    //             const variantOptions = variant.variantOptions.map((option) => option.value).join(',');
    //             const variantHex = variant.variantOptions.map((option) => option.colorHex || '').join(',');

    //             rows.push({
    //                 id: index + 1,
    //                 product_name: variantIndex === 0 ? product.productName : '',
    //                 product_description: variantIndex === 0 ? product.productDescription : '',
    //                 product_sku: variantIndex === 0 ? product.productSku : '',
    //                 default_price: variantIndex === 0 ? product.defaultPrice : '',
    //                 variant_name: index < 3 ? 'Color,Size,Texture' : 'Color,Size',
    //                 variant_option: variantOptions,
    //                 variant_option_hex: variantHex,
    //                 variant_sku: variant.sku,
    //                 variant_price: variant.price || '',
    //             });
    //         });
    //     });

    //     const worksheet = XLSX.utils.json_to_sheet(rows);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    //     XLSX.writeFile(workbook, 'products.xlsx');
    // };

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 p-0">
                    <div class="row  m-0 w-100 px-3">
                        <div class="col-lg-12 p-0">
                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                        Merchant Items
                                    </p>
                                </div>
                                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                                    <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                        <button
                                            style={{ height: '35px' }}
                                            class={generalstyles.roundbutton + '  mb-1 mx-2'}
                                            onClick={() => {
                                                if (isAuth([1, 52, 74])) {
                                                    setmerchantModal(true);
                                                    settype('additem');
                                                } else {
                                                    history.push('/additem');
                                                }
                                            }}
                                        >
                                            Add New Item
                                        </button>
                                        <button
                                            style={{ height: '35px' }}
                                            class={generalstyles.roundbutton + '  mb-1 '}
                                            onClick={() => {
                                                if (isAuth([1, 52, 75])) {
                                                    setmerchantModal(true);
                                                    settype('importbulk');
                                                } else {
                                                    setimportModal(true);
                                                }
                                            }}
                                        >
                                            Import Bulk
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {cookies.get('merchantId') == undefined && <MerchantSelect fiter={payload} setFilter={setPayload} />}
                    </div>
                </div>

                {isAuth([1, 52, 12]) && (
                    <>
                        <div class="col-lg-12 px-3">
                            <div class={generalstyles.card + ' row m-0 w-100 mb-4 p-2 px-2'}>
                                <div class="col-lg-6">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            // disabled={props?.disabled}
                                            // type={props?.type}
                                            class={formstyles.form__field}
                                            value={payload?.name}
                                            placeholder={'Search by name '}
                                            onChange={() => {
                                                setPayload({ ...payload, name: event.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-6 ">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            // disabled={props?.disabled}
                                            // type={props?.type}
                                            class={formstyles.form__field}
                                            value={payload?.sku}
                                            placeholder={'Search by SKU'}
                                            onChange={() => {
                                                setPayload({ ...payload, sku: event.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div class={generalstyles.card + ' row m-0 w-100'}> */}
                        <div class="col-lg-12 mb-2 p-0 mb-3">
                            <Pagination
                                beforeCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.afterCursor}
                                filter={payload}
                                setfilter={setPayload}
                            />
                        </div>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar px-1 '}>
                            <ItemsTable card="col-lg-3" items={fetchMerchantItemsQuery?.data?.paginateItems?.data} showEllipsis={true} />
                        </div>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.afterCursor}
                                filter={payload}
                                setfilter={setPayload}
                            />
                        </div>
                        {/* </div> */}
                    </>
                )}
            </div>
            <Modal
                show={merchantModal}
                onHide={() => {
                    setmerchantModal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Choose Merchant</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setmerchantModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <MerchantSelectComponent
                                type="single"
                                label={'name'}
                                value={'id'}
                                onClick={(option) => {
                                    if (type == 'additem') {
                                        history.push('/additem?merchantId=' + option?.id);
                                    } else {
                                        settype(option.id);
                                        setimportModal(true);
                                    }
                                }}
                                removeAll={true}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={importModal}
                onHide={() => {
                    setimportModal(false);
                }}
                centered
                size={'xl'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Import CSV</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1 mx-2 '}
                                disabled={buttonLoadingContext}
                                onClick={async () => {
                                    window.open('https://greenline-bucket.s3.amazonaws.com/75b1701a-6ae7-4d5d-aabe-8057aa473d37');
                                }}
                            >
                                Download Template
                            </button>
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setimportModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class="col-lg-12">
                            <Inputfield
                                placeholder={'CSV File'}
                                onChange={(event) => {
                                    // setcsvFile(event.target.files[0]);
                                    if (event.target.files[0]) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            if (cookies.get('ImportCSVName') != event.target.files[0].name) {
                                                cookies.set('ImportCSVName', event.target.files[0].name);
                                                cookies.remove('ImportedItems');
                                            }
                                            const base64String = reader.result.split(',')[1]; // Extract Base64 part
                                            setcsvFile(base64String);
                                        };
                                        reader.readAsDataURL(event.target.files[0]);
                                    }
                                }}
                                type={'file'}
                            />
                        </div>
                        <div class="col-lg-12 allcentered">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1 '}
                                disabled={buttonLoadingContext}
                                onClick={async () => {
                                    if (buttonLoadingContext) return;
                                    setbuttonLoadingContext(true);
                                    try {
                                        const { data } = await uploadExcelFileMutation();

                                        if (data?.uploadExcelFile?.result) {
                                            await setimportedDataContext([...data?.uploadExcelFile?.result]);

                                            NotificationManager.success('', 'Success');
                                            history.push('/additem?import=true&merchantId=' + type);
                                        } else {
                                            NotificationManager.warning(data?.uploadExcelFile?.message, 'Warning!');
                                        }
                                    } catch (error) {
                                        let errorMessage = 'An unexpected error occurred';
                                        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                            errorMessage = error.graphQLErrors[0].message || errorMessage;
                                        } else if (error.networkError) {
                                            errorMessage = error.networkError.message || errorMessage;
                                        } else if (error.message) {
                                            errorMessage = error.message;
                                        }
                                        NotificationManager.warning(errorMessage, 'Warning!');
                                    }
                                    setbuttonLoadingContext(false);
                                }}
                            >
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <>{'Import'}</>}
                            </button>
                        </div>

                        <div style={{ background: '#EFF4F8' }} class={generalstyles.card + ' my-3 col-lg-12 p-2'}>
                            <Accordion allowMultipleExpanded={true} allowZeroExpanded={true} preExpanded={['import-instructions']}>
                                <AccordionItem
                                    class={`${generalstyles.innercard}` + ' p-2'}
                                    uuid="import-instructions" // Unique ID for this accordion item
                                >
                                    <AccordionItemHeading>
                                        <AccordionItemButton>
                                            <div class="row m-0 w-100">
                                                <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                    <p class={generalstyles.cardTitle + ' m-0 p-0 '}>Import Instructions</p>
                                                </div>
                                                <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                                    <AccordionItemState>
                                                        {(state) => {
                                                            if (state.expanded) {
                                                                return (
                                                                    <i class="h-100 d-flex align-items-center justify-content-center">
                                                                        <BsChevronUp />
                                                                    </i>
                                                                );
                                                            } else {
                                                                return (
                                                                    <i class="h-100 d-flex align-items-center justify-content-center">
                                                                        <BsChevronDown />
                                                                    </i>
                                                                );
                                                            }
                                                        }}
                                                    </AccordionItemState>
                                                </div>
                                            </div>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel>
                                        <hr className="mt-2 mb-3" />
                                        <div class="row m-0 w-100">
                                            <div dangerouslySetInnerHTML={{ __html: content }} />
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default MerchantItems;
