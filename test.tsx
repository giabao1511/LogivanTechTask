import _ from "lodash";
import { Text, View } from "react-native";
import { useMemo, memo } from "react";

import { widthPercentageToDP } from "src/helpers/responsive";

const statusStep = {
  current: "current",
  complete: "complete",
  created: "created",
};

const typeStep = {
  start: "start",
  going_to_pickup: "going_to_pickup",
  loading: "loading",
  going_to_dropoff: "going_to_dropoff",
  unloading: "unloading",
  end: "end",
};

interface Step {
  id: string;
  type: string;
  status: string;
  delivery: any;
  additional_steps?: Step[];
}

/* I split those states to variables because I want to make the code more clearly, and those states can be reused multiple time, 
when we want to change their values, just change right here, easy for debugging and maintanance. Furthermore, those states will 
depend on the values of the statusStep, so that it will available with any kind of value that we could change in statusStep and typeStep*/ 

const statusColors = {
  [statusStep.current]: "#FE6F12",
  [statusStep.complete]: "green",
  [statusStep.created]: "#AAAAAA",
};

const statusTexts = {
  [statusStep.current]: "Đang thực hiện",
  [statusStep.complete]: "Đã hoàn thành",
  [statusStep.created]: "Sắp tới",
};

const typeTexts = {
  [typeStep.start]: "Bắt đầu chuyến",
  [typeStep.going_to_pickup]: "Đến điểm bốc",
  [typeStep.loading]: "Bốc hàng",
  [typeStep.going_to_dropoff]: "Đến điểm dỡ",
  [typeStep.unloading]: "Dỡ hàng",
  [typeStep.end]: "Hoàn thành",
};

export const ShipmentStep = ({
  stepData,
  numberStep,
}: {
  stepData: Step;
  numberStep: number;
}) => {
  /* I use destructuring in ES6 here to split 3 variable match with 3 property in stepData. This will shorten the
  code and make it more readable.  */ 
  const { status, type, additional_steps } = stepData;

  /* I use useMemo Hook here because I want to memorize some variable that no need to be
   recalculated every time the component re-renders, just when their dependencies change.*/

  // Memoize the handleColor function
  const memoizedColor = useMemo(() => statusColors[status], [status]);
  // Memoize the handleColorText function
  const memoizedColorText = useMemo(() => statusColors[status], [status]);
  // Memoize the handleTitleStatus function
  const memoizedTitleStatus = useMemo(
    () => statusTexts[status] || "",
    [status]
  );
  // Memoize the handleTitleType function
  const memoizedTitleType = useMemo(() => typeTexts[type] || "", [type]);

  const handleDescription = (element?: any) => {
    const typeHandle = element?.type || type;
    const delivery = element?.delivery || stepData?.delivery;

    /* I use Switch Case here instead of If else for several reasons: 
    - First, a switch statement is more appropriate in this case because we are checking multiple cases against the typeHandle value.
    - Secondly, for a large number of cases, a switch statement can be more readable than a chain of if-else statements */

    switch (typeHandle) {
      case typeStep.start:
        return status === statusStep.complete
          ? "Đã bắt đầu chuyến"
          : "Đã nhận đơn, hãy chuẩn bị thật kỹ để bắt đầu chuyến";

      case typeStep.going_to_pickup:
        return delivery?.pickup_location?.description || "no data";

      case typeStep.loading:
      case typeStep.unloading:
        return `Mặt hàng: ${delivery?.cargo_types}`;

      case typeStep.going_to_dropoff:
        return delivery?.dropoff_location?.description || "no data";

      case typeStep.end:
        return "Kết thúc chuyến";

      default:
        return "";
    }
  };

  const handleDescriptionAdditionalStep = () => {
    /* I remove the If (element) check in the "map" function because I think it's not necessary to check for null or undefined values, 
    the "handleDescription" function will check for us. Instead of using filter to remove "null" values, we can directly use filter(Boolean) 
    to filter out falsy values (including "null"). */
    return additional_steps?.map(handleDescription).filter(Boolean) || [];
  };

  // Memoize the descriptions array
  const memoizedDescriptions = useMemo(() => {
    return _.uniqBy(
      [handleDescription(), ...handleDescriptionAdditionalStep()] || [],
      (e) => e
    );
  }, [stepData, additional_steps]);

  return (
    /* Beside that, I think we should split the style to the css file or the style object for reusing and making the code 
    more easier to read. It will shorten the "return" code and when we want to see its styles, we just need to click on the css file or
    css object to see it, it will be more clearly */
    <View
      style={[
        {
          flexDirection: "row",
        },
        status !== statusStep.current && {
          opacity: 0.5,
        },
      ]}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: widthPercentageToDP(3),
            height: widthPercentageToDP(3),
            borderRadius: widthPercentageToDP(3),
            backgroundColor: memoizedColor,
          }}
        />
        <View
          style={{
            width: widthPercentageToDP(0.5),
            backgroundColor: memoizedColor,
            flex: 1,
          }}
        />
      </View>
      <View
        style={[
          {
            flex: 1,
            borderRadius: widthPercentageToDP(2),
            margin: widthPercentageToDP(2),
            padding: widthPercentageToDP(2),
            gap: widthPercentageToDP(2),
          },
          status === statusStep.current && {
            borderWidth: 2,
            borderColor: "#FE6F12",
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            gap: widthPercentageToDP(2),
          }}
        >
          <View
            style={{
              backgroundColor: memoizedColor,
              justifyContent: "center",
              alignItems: "center",
              width: widthPercentageToDP(8),
              height: widthPercentageToDP(8),
              borderRadius: widthPercentageToDP(1),
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#fff" }}>
              {numberStep >= 10 ? numberStep : `0${numberStep}`}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: memoizedColorText,
              }}
            >
              {memoizedTitleStatus}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {memoizedTitleType}
            </Text>
          </View>
        </View>
        {/* I use FlatList here instead of View because FlatList will be more suitable for rendering a large list than View, it uses lazy Loading
        to renders the items that are currently visible on the screen and unmounts the components that go off-screen.*/}
        <FlatList
          data={memoizedDescriptions}
          renderItem={({ item }) => (
            <Text style={{ color: memoizedColorText }}>{item}</Text>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};
