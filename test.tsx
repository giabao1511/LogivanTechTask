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

const styles = {
  rowContainerStyle: {
    flexDirection: "row",
  },
  inActiveStep: {
    opacity: 0.5,
  },
};

export const ShipmentStep = ({
  stepData,
  numberStep,
}: {
  stepData: Step;
  numberStep: number;
}) => {
  const { status, type, additional_steps } = stepData;

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
        <View>
          {memoizedDescriptions?.map((item, index) => {
            return (
              <Text
                key={index}
                style={{
                  color: memoizedColorText,
                }}
              >
                {item}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};
