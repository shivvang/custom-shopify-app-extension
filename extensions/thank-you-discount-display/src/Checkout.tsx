import  {useEffect, useState} from "react";
import {
  reactExtension,
  Button,
  BlockStack,
  Text,
  Banner,
  ClipboardItem,
  InlineStack,
  Image,
  useApi,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.thank-you.block.render", () => <Extension />);

function Extension() {
  const [copied, setCopied] = useState(false);
  const [discountCode,setDiscountCode] = useState("THANKYOU15")
  const [message,setMessage] = useState("Special Discount Coupon For Sweet Dreams :")
  const {query} = useApi();

// thank_you_code
// thank_you_message

  useEffect(()=>{
    async function fetchData() {
      try {
        const result = await query(`{
          shop {
            codeMetafield: metafield(namespace: "custom", key: "thank_you_code") {
              value
            }
            messageMetafield: metafield(namespace: "custom", key: "thank_you_message") {
              value
            }
          }
        }`);
            
        // Update state with fetched data
        if (result?.shop?.codeMetafield?.value) {
          setDiscountCode(result.shop.codeMetafield.value);
        }
        if (result?.shop?.messageMetafield?.value) {
          setMessage(result.shop.messageMetafield.value);
        }
      } catch (error) {
        console.error("Error fetching metafields:", error);
      }
    }

    fetchData();
  },[])
  return (
    <BlockStack spacing="base">

      <Banner status="success">
      <InlineStack inlineAlignment={"center"}>
          <BlockStack>
            <Text size="medium" emphasis="bold">
              {message}
            </Text>
           <InlineStack inlineAlignment={"center"} blockAlignment={"center"}>
              <Text size="large" emphasis="bold">
                  {discountCode}
              </Text>
              <Button  activateTarget="discount-code" activateAction="copy" kind="secondary">
                <Image source={"https://img.icons8.com/small/16/copy.png"}/> 
              </Button>
           </InlineStack>
          </BlockStack>
      </InlineStack>
    </Banner>
      <ClipboardItem
        id="discount-code"
        text={discountCode}
        onCopy={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }}
        onCopyError={() => {
          console.error("ClipboardItem copy failed");
        }}
      />

      {copied && (
        <Banner title="Copied!" status="success">
          Discount code copied to your clipboard.
        </Banner>
      )}
    </BlockStack>
  );
}
