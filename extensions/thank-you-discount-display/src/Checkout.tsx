import { useEffect, useState } from "react";
import {
  reactExtension,
  Button,
  BlockStack,
  Text,
  Banner,
  ClipboardItem,
  InlineStack,
  Image,
  View,
  useApi,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

interface MetafieldResponse {
  data: {
    shop: {
      codeMetafield?: { value: string | null };
      messageMetafield?: { value: string | null };
      shopCtaMetafield?: { value: string | null };
    };
  };
}


function Extension() {
  const [loading, setLoading] = useState<boolean>(true);
  const [discountCode, setDiscountCode] = useState<string>("THANKYOU15");
  const [message, setMessage] = useState<string>(
    "Special Discount Coupon For Sweet Dreams :"
  );
  const [shopcta,setShopCta] = useState<string>("https://www.sweetdreams.in/"); 
  const { query } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = (await query(
          `{
          shop {
            codeMetafield: metafield(namespace: "custom", key: "thank_you_code") {
              value
            }
            messageMetafield: metafield(namespace: "custom", key: "thank_you_message") {
              value
            } shopCtaMetafield: metafield(namespace: "custom", key: "thank_you_shopcta") {
              value
            }
          }
        }`
        )) as MetafieldResponse;

        const code = result?.data?.shop?.codeMetafield?.value;
        const msg = result?.data?.shop?.messageMetafield?.value;
        const cta = result?.data.shop?.shopCtaMetafield?.value;

        if (code) setDiscountCode(code);
        if (msg) setMessage(msg);
        if(cta) setShopCta(cta);
      } catch (error) {
        console.error("Error fetching metafields:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log("shop cta",shopcta);
  return loading ? (
    <Banner status="info">
      <InlineStack inlineAlignment="center">
        <BlockStack>
          <Text size="medium" emphasis="bold">
            Fetching your discount...
          </Text>
          <InlineStack inlineAlignment="center" blockAlignment="center">
            <Text size="large" emphasis="bold">
              ⏳ Loading...
            </Text>
          </InlineStack>
        </BlockStack>
      </InlineStack>
    </Banner>
  ) : (
    <Banner  
    status="success"
    >
    <InlineStack  spacing={"loose"} inlineAlignment={"center"} blockAlignment={"center"}> 
      <View maxInlineSize={80} maxBlockSize={80}>
       <Image source={"https://cdn-icons-png.freepik.com/256/1140/1140033.png?semt=ais_white_label"}/>
      </View>
      <BlockStack inlineAlignment={"center"}>
          <BlockStack inlineAlignment={"center"}>
          <Text size="large" emphasis="bold">Grab Your Gift!</Text> 
          <Text size="medium" emphasis="bold">
            {message}
          </Text>
          </BlockStack>
          <InlineStack inlineAlignment={"center"} blockAlignment={"center"}>    
            <InlineStack
              blockAlignment="center"
              spacing="tight"
              border="base"
              borderRadius="large"
              padding="tight"
            >
              
              <Text size="medium" emphasis="bold">
                {discountCode}
              </Text>

              <Button
                activateTarget="discount-code"
                activateAction="copy"
                kind="secondary"
              >
                <Image source="https://img.icons8.com/small/16/copy.png" />
              </Button>
            </InlineStack>

           
            <Button
            to={shopcta}
            kind="primary"
            appearance="monochrome"
           >Shop Now</Button>
           
          </InlineStack>
      </BlockStack>
      <ClipboardItem id="discount-code" text={discountCode} />
    </InlineStack>
    </Banner>
  );
}
