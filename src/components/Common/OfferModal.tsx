import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  FreeAgentOffer,
  League,
  OfferAction,
  SimNBA,
  SimNFL,
  SimPHL,
  WaiverOffer,
} from "../../_constants/constants";
import {
  FreeAgencyOffer as PHLFreeAgencyOffer,
  ProfessionalPlayer,
  WaiverOffer as PHLWaiverOffer,
  Timestamp as HCKTimestamp,
  ProCapsheet,
  FreeAgencyOfferDTO,
} from "../../models/hockeyModels";
import {
  FreeAgencyOffer as NFLFreeAgencyOffer,
  NFLPlayer,
  NFLWaiverOffer,
  Timestamp as FBTimestamp,
  NFLCapsheet,
} from "../../models/footballModels";
import {
  NBAContractOffer,
  NBAPlayer,
  NBAWaiverOffer,
  Timestamp as BKTimestamp,
  NBACapsheet,
} from "../../models/basketballModels";
import { Modal } from "../../_design/Modal";
import { Text } from "../../_design/Typography";
import { Border } from "../../_design/Borders";
import { Input } from "../../_design/Inputs";
import { Button, ButtonGroup } from "../../_design/Buttons";
import {
  createOffer,
  GeneratePHLFAErrorList,
  getPHLSalaryData,
} from "../../_helper/offerHelper";

interface OfferModalProps {
  action: OfferAction;
  player: ProfessionalPlayer | NFLPlayer | NBAPlayer;
  existingOffer?:
    | PHLFreeAgencyOffer
    | PHLWaiverOffer
    | NFLFreeAgencyOffer
    | NFLWaiverOffer
    | NBAContractOffer
    | NBAWaiverOffer;
  league: League;
  isOpen: boolean;
  ts: HCKTimestamp | FBTimestamp | BKTimestamp;
  capsheet: ProCapsheet | NFLCapsheet | NBACapsheet;
  onClose: () => void;
  confirmOffer: (dto: any) => Promise<void>;
}

export const OfferModal: FC<OfferModalProps> = ({
  isOpen,
  onClose,
  action,
  player,
  league,
  existingOffer,
  ts,
  capsheet,
  confirmOffer,
}) => {
  const [offer, setOffer] = useState<
    | PHLFreeAgencyOffer
    | PHLWaiverOffer
    | NFLFreeAgencyOffer
    | NFLWaiverOffer
    | NBAContractOffer
    | NBAWaiverOffer
  >(() => {
    if (league === SimNFL && action === FreeAgentOffer) {
      return new NFLFreeAgencyOffer({ existingOffer });
    }
    if (league === SimNFL && action === WaiverOffer) {
      return new NFLWaiverOffer({ existingOffer });
    }
    if (league === SimNBA && action === FreeAgentOffer) {
      return new NBAContractOffer({ existingOffer });
    }
    if (league === SimNBA && action === WaiverOffer) {
      return new NBAWaiverOffer({ existingOffer });
    }
    if (league === SimPHL && action === WaiverOffer) {
      return new PHLWaiverOffer({ existingOffer });
    }
    if (league === SimNFL && action === FreeAgentOffer) {
      return new NFLFreeAgencyOffer();
    }
    if (league === SimNFL && action === WaiverOffer) {
      return new NFLWaiverOffer();
    }
    if (league === SimNBA && action === FreeAgentOffer) {
      return new NBAContractOffer();
    }
    if (league === SimNBA && action === WaiverOffer) {
      return new NBAWaiverOffer();
    }
    if (league === SimPHL && action === WaiverOffer) {
      return new PHLWaiverOffer();
    }
    return new PHLFreeAgencyOffer();
  });

  useEffect(() => {
    setOffer(createOffer(league, action, existingOffer));
  }, [existingOffer, league, action]);

  const playerLabel = `${player.Age} year, ${player.Position} ${player.FirstName} ${player.LastName}`;
  let title = "";
  if (action === FreeAgentOffer) {
    title = `Offer ${playerLabel}`;
  } else if (action === WaiverOffer) {
    title = `Pick Up ${playerLabel}`;
  }

  const totalBonus = useMemo(() => {
    if (!offer || !(offer instanceof NFLFreeAgencyOffer)) return 0;
    return (
      offer.Y1Bonus +
      offer.Y2Bonus +
      offer.Y3Bonus +
      offer.Y4Bonus +
      offer.Y5Bonus
    );
  }, [offer]);

  const totalSalary = useMemo(() => {
    if (!offer) return 0;
    if (
      league === SimNFL &&
      (offer instanceof NFLFreeAgencyOffer ||
        offer instanceof PHLFreeAgencyOffer)
    ) {
      return (
        offer.Y1BaseSalary +
        offer.Y2BaseSalary +
        offer.Y3BaseSalary +
        offer.Y4BaseSalary +
        offer.Y5BaseSalary
      );
    }
    if (league === SimNBA && offer instanceof NBAContractOffer) {
      return (
        offer.Year1Total +
        offer.Year2Total +
        offer.Year3Total +
        offer.Year4Total +
        offer.Year5Total
      );
    }
    return 0;
  }, [offer]);

  const contractValue = useMemo(() => {
    if (league === SimPHL && offer instanceof PHLFreeAgencyOffer) {
      const {
        ContractLength,
        Y1BaseSalary,
        Y2BaseSalary,
        Y3BaseSalary,
        Y4BaseSalary,
        Y5BaseSalary,
      } = offer;
      if (!ContractLength || ContractLength === 0) return 0;
      let y1 = Y1BaseSalary ? Y1BaseSalary : 0;
      let y2 = Y2BaseSalary ? Y2BaseSalary : 0;
      let y3 = Y3BaseSalary ? Y3BaseSalary : 0;
      let y4 = Y4BaseSalary ? Y4BaseSalary : 0;
      let y5 = Y5BaseSalary ? Y5BaseSalary : 0;
      const total = y1 + y2 + y3 + y4 + y5;
      if (isNaN(total)) return 0;
      return total / ContractLength;
    }
    return 0;
  }, [offer]);

  const errors = useMemo(() => {
    const list: string[] = [];
    if (league === SimPHL) {
      return GeneratePHLFAErrorList(
        offer as PHLFreeAgencyOffer,
        ts as HCKTimestamp,
        capsheet as ProCapsheet
      );
    }
    return list;
  }, [offer, capsheet, ts]);

  const ChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const val = Number(value);
      setOffer((prev) => {
        if (prev instanceof NFLFreeAgencyOffer) {
          return prev.updateField(name, val);
        }
        if (prev instanceof NBAContractOffer) {
          return prev.updateField(name, val);
        }
        if (prev instanceof PHLFreeAgencyOffer) {
          return prev.updateField(name, val);
        }
        return prev;
      });
    },
    [league]
  );

  const Confirm = async () => {
    if (league === SimPHL) {
      const { totalComp, ContractLength } = getPHLSalaryData(
        offer as PHLFreeAgencyOffer
      );
      if (totalComp === 0 && ContractLength === 0) {
        onClose();
        return;
      }
      const dto = new FreeAgencyOfferDTO({
        ...offer,
        PlayerID: player.ID,
        TeamID: capsheet.ID,
      });
      await confirmOffer(dto);
    }

    onClose();
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        actions={
          <>
            <ButtonGroup>
              <Button variant="danger" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={errors.length === 0 ? "success" : "warning"}
                disabled={errors.length > 0}
                onClick={Confirm}
              >
                Confirm
              </Button>
            </ButtonGroup>
          </>
        }
        maxWidth="min-[1025px]:max-w-[60vw]"
      >
        <div className="grid grid-cols-[2fr__3fr] space-x-2 mb-2">
          <Border direction="col" classes="text-start p-3">
            <Text variant="h6">Rules</Text>
            <Text variant="small">
              - Contracts need to be between 1 through 5 years.
            </Text>
            {league === SimPHL && (
              <Text variant="small">
                - AAV is calculated using the total of all inputs divided by the
                length of the contract.
              </Text>
            )}
          </Border>
          <Border
            direction="col"
            classes="text-start p-3 flex-wrap overflow-y-auto"
          >
            <Text variant="h6">Errors</Text>
            {errors.length === 0 && <Text variant="small">None</Text>}
            {errors.length > 0 &&
              errors.map((err) => (
                <Text key={err} variant="small" classes="text-red-500">
                  {err}
                </Text>
              ))}
          </Border>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 space-y-1 lg:space-y-0 space-x-2 mb-2">
          <div className="flex">
            {(offer instanceof PHLFreeAgencyOffer ||
              offer instanceof NFLFreeAgencyOffer) && (
              <Input
                type="number"
                label="Length"
                name="ContractLength"
                value={offer.ContractLength || 0}
                onChange={ChangeInput}
              />
            )}
          </div>
          <div className="flex"></div>
          <div className="flex"></div>
          <div className="flex"></div>
          <div className="flex"></div>
          <div className="flex">
            {offer instanceof PHLFreeAgencyOffer && (
              <Input
                type="number"
                label="AAV"
                name="AAV"
                value={contractValue}
                disabled
              />
            )}
          </div>
        </div>
        {league === SimNFL && offer instanceof NFLFreeAgencyOffer && (
          <div className="grid grid-cols-6 space-x-2">
            <div className="flex">
              <Input
                type="number"
                label="Y1 Bonus"
                name="Y1Bonus"
                value={offer.Y1Bonus || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y2 Bonus"
                name="Y2Bonus"
                value={offer.Y2Bonus || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y3 Bonus"
                name="Y3Bonus"
                value={offer.Y3Bonus || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y4 Bonus"
                name="Y4Bonus"
                value={offer.Y4Bonus || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y5 Bonus"
                name="Y5Bonus"
                value={offer.Y5Bonus || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Total Bonus"
                name="TotalBonus"
                value={totalBonus}
                disabled
              />
            </div>
          </div>
        )}
        {league === SimNBA && offer instanceof NBAContractOffer && (
          <div className="grid grid-cols-6 space-x-2 mb-2">
            <div className="flex flex-col">
              <Input
                type="number"
                label="Y1 Salary"
                name="Year1Total"
                value={offer.Year1Total || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y2 Salary"
                name="Year2Total"
                value={offer.Year2Total || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y3 Salary"
                name="Year3Total"
                value={offer.Year3Total || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y4 Salary"
                name="Year4Total"
                value={offer.Year4Total || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y5 Salary"
                name="Year5Total"
                value={offer.Year5Total || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Total Salary"
                name="TotalSalary"
                value={totalSalary}
                disabled
              />
            </div>
          </div>
        )}
        {league === SimPHL && offer instanceof PHLFreeAgencyOffer && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 space-y-[0.5rem] md:space-y-2 lg:space-y-0 space-x-2 mb-2">
            <div className="flex">
              <Input
                type="number"
                label="Y1 Salary"
                name="Y1BaseSalary"
                value={offer.Y1BaseSalary || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y2 Salary"
                name="Y2BaseSalary"
                value={offer.Y2BaseSalary || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y3 Salary"
                name="Y3BaseSalary"
                value={offer.Y3BaseSalary || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y4 Salary"
                name="Y4BaseSalary"
                value={offer.Y4BaseSalary || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y5 Salary"
                name="Y5BaseSalary"
                value={offer.Y5BaseSalary || 0}
                onChange={ChangeInput}
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Total Salary"
                name="TotalSalary"
                value={totalSalary}
                disabled
              />
            </div>
          </div>
        )}
        {league === SimNFL && offer instanceof NFLFreeAgencyOffer && (
          <div className="grid grid-cols-6 space-x-2">
            <div className="flex">
              <Input
                type="number"
                label="Y1 Total"
                name="Y1Bonus"
                value={offer.Y1Bonus + offer.Y1BaseSalary || 0}
                disabled
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y2 Total"
                name="Y2Bonus"
                value={offer.Y2Bonus + offer.Y2BaseSalary || 0}
                disabled
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y3 Total"
                name="Y3Bonus"
                value={offer.Y3Bonus + offer.Y3BaseSalary || 0}
                disabled
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y4 Total"
                name="Y4Bonus"
                value={offer.Y4Bonus + offer.Y4BaseSalary || 0}
                disabled
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Y5 Total"
                name="Y5Bonus"
                value={offer.Y5Bonus + offer.Y5BaseSalary || 0}
                disabled
              />
            </div>
            <div className="flex">
              <Input
                type="number"
                label="Total"
                name="Total"
                value={totalBonus + totalSalary}
                disabled
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
