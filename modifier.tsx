import React, { useMemo } from "react";
import { Text, View, FlatList, ListRenderItem, ViewStyle } from "react-native";
import _ from "lodash";

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

interface Props {
  stepData: Step;
  numberStep: number;
}

interface Step {
  id: string;
  type: string;
  status: string;
  delivery: any;
  additional_steps?: Step[];
}

const statusColors: Record<string, string> = {
  [statusStep.current]: "#FE6F12",
  [statusStep.complete]: "green",
  [statusStep.created]: "#AAAAAA",
};

const typeTitles: Record<string, string> = {
  [typeStep.start]: "Bắt đầu chuyến",
  [typeStep.going_to_pickup]: "Đến điểm bốc",
  [typeStep.loading]: "Bốc hàng",
  [typeStep.going_to_dropoff]: "Đến điểm dỡ",
  [typeStep.unloading]: "Dỡ hàng",
  [typeStep.end]: "Hoàn thành",
};

const typeDescriptions: Record<string, (data: any) => string> = {
  [typeStep.start]: (data: any) =>
    data.status === statusStep.complete
      ? "Đã bắt đầu chuyến"
      : "Đã nhận đơn, hãy chuẩn bị thật kỹ để bắt đầu chuyến",
  [typeStep.going_to_pickup]: (data: any) =>
    data?.delivery?.pickup_location?.description || "no data",
  [typeStep.loading]: (data: any) => "Mặt hàng: " + data?.delivery?.cargo_types,
  [typeStep.going_to_dropoff]: (data: any) =>
    data?.delivery?.dropoff_location?.description || "no data",
  [typeStep.unloading]: (data: any) =>
    "Mặt hàng: " + data?.delivery?.cargo_types,
  [typeStep.end]: () => "Kết thúc chuyến",
};

const ShipmentStep: React.FC<Props> = React.memo(({ stepData, numberStep }) => {
  const { status, type, additional_steps } = stepData;

  const getColorAndText = useMemo(() => {
    const color = statusColors[status] || "#AAAAAA";
    const text =
      status === statusStep.current ? "Đang thực hiện" : "Đã hoàn thành";
    return { color, text };
  }, [status]);

  const getDescription = (stepData: any) => {
    const typeHandle = stepData?.type || type;
    return typeDescriptions[typeHandle](stepData);
  };

  const additionalStepDescriptions = useMemo(() => {
    return additional_steps
      ? additional_steps.map(getDescription).filter(Boolean)
      : [];
  }, [additional_steps, getDescription]);

  const uniqueDescriptions = useMemo(() => {
    return _.uniqBy(
      [getDescription(stepData), ...additionalStepDescriptions],
      (desc) => desc
    );
  }, [stepData, additionalStepDescriptions, getDescription]);

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Text style={styles.stepDescription}>{item}</Text>
  );

  return (
    <View
      style={[
        styles.stepContainer,
        status !== statusStep.current && styles.inactiveStep,
      ]}
    >
      {/* ... (unchanged) */}
      <View>
        <FlatList
          data={uniqueDescriptions}
          keyExtractor={(item, index) => `${index}-${item}`}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
});

const styles = {
  stepContainer: {
    flexDirection: "row",
  },
  inactiveStep: {
    opacity: 0.5,
  },
  circleConnector: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: widthPercentageToDP(3),
    height: widthPercentageToDP(3),
    borderRadius: widthPercentageToDP(3),
  },
  connectorLine: {
    width: widthPercentageToDP(0.5),
    flex: 1,
  },
  stepContent: {
    flex: 1,
    borderRadius: widthPercentageToDP(2),
    margin: widthPercentageToDP(2),
    padding: widthPercentageToDP(2),
    gap: widthPercentageToDP(2),
  },
  stepInfo: {
    flexDirection: "row",
    gap: widthPercentageToDP(2),
  },
  stepNumber: {
    justifyContent: "center",
    alignItems: "center",
    width: widthPercentageToDP(8),
    height: widthPercentageToDP(8),
    borderRadius: widthPercentageToDP(1),
  },
  stepNumberText: {
    fontWeight: "bold",
    color: "#fff",
  },
  stepStatus: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  stepType: {
    color: "#AAAAAA",
  },
  stepDescription: {
    color: "#AAAAAA",
  },
};

export default ShipmentStep;
