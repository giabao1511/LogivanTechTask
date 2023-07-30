import _ from "lodash";
import { Text, View } from "react-native";

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

export const ShipmentStep = ({
  stepData,
  numberStep,
}: {
  stepData: Step;
  numberStep: number;
}) => {
  const status = stepData?.status;
  const type = stepData?.type;
  const additional_steps = stepData?.additional_steps;

  const handleColor = () => {
    if (status === statusStep.current) {
      return "#FE6F12";
    }
    if (status === statusStep.complete) {
      return "green";
    }
    if (status === statusStep.created) {
      return "#AAAAAA";
    }
  };
  const handleColorText = () => {
    if (status === statusStep.current) {
      return "#FE6F12";
    }
    if (status === statusStep.complete) {
      return "#AAAAAA";
    }
    if (status === statusStep.created) {
      return "#AAAAAA";
    }
  };

  const handleTitleStatus = () => {
    if (status === statusStep.current) {
      return "Đang thực hiện";
    }
    if (status === statusStep.complete) {
      return "Đã hoàn thành";
    }
    if (status === statusStep.created) {
      return "Sắp tới";
    }
  };

  const handleTitleType = () => {
    if (type === typeStep.start) {
      return "Bắt đầu chuyến";
    }
    if (type === typeStep.going_to_pickup) {
      return "Đến điểm bốc";
    }
    if (type === typeStep.loading) {
      return "Bốc hàng";
    }
    if (type === typeStep.going_to_dropoff) {
      return "Đến điểm dỡ";
    }
    if (type === typeStep.unloading) {
      return "Dỡ hàng";
    }
    if (type === typeStep.end) {
      return "Hoàn thành";
    }
  };

  const handleDescription = (element?: any) => {
    const typeHandle = element?.type || type;

    const delivery = element?.delivery || stepData?.delivery;

    if (typeHandle === typeStep.start) {
      if (status === statusStep.complete) {
        return "Đã bắt đầu chuyến";
      }
      return "Đã nhận đơn, hãy chuẩn bị thật kỹ để bắt đầu chuyến";
    }
    if (typeHandle === typeStep.going_to_pickup) {
      return delivery?.pickup_location?.description || "no data";
    }
    if (typeHandle === typeStep.loading) {
      return "Mặt hàng: " + delivery?.cargo_types;
    }
    if (typeHandle === typeStep.going_to_dropoff) {
      return delivery?.dropoff_location?.description || "no data";
    }
    if (typeHandle === typeStep.unloading) {
      return "Mặt hàng: " + delivery?.cargo_types;
    }
    if (typeHandle === typeStep.end) {
      return "Kết thúc chuyến";
    }
  };

  const handleDescriptionAdditionalStep = () => {
    const result =
      additional_steps?.map((element: any) => {
        if (element) {
          return handleDescription(element);
        }
        return null;
      }) || [];
    return result?.filter((e: any) => !!e);
  };

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
            backgroundColor: handleColor(),
          }}
        />
        <View
          style={{
            width: widthPercentageToDP(0.5),
            backgroundColor: handleColor(),
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
              backgroundColor: handleColor(),
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
                color: handleColorText(),
              }}
            >
              {handleTitleStatus()}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {handleTitleType()}
            </Text>
          </View>
        </View>
        <View>
          {_.uniqBy(
            [handleDescription(), ...handleDescriptionAdditionalStep()] || [],
            (e) => e
          )?.map((item) => {
            return (
              <Text
                style={{
                  color: handleColorText(),
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
