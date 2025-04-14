import { FC, useState } from "react";
import { FreeAgentOffer, League, OfferAction, WaiverOffer } from "../../_constants/constants";
import { FreeAgencyOffer, ProfessionalPlayer, WaiverOffer as PHLWaiverOffer } from "../../models/hockeyModels";
import { NFLPlayer } from "../../models/footballModels";
import { NBAPlayer } from "../../models/basketballModels";
import { Modal } from "../../_design/Modal";
import { Text } from "../../_design/Typography";

interface OfferModalProps {
    action: OfferAction;
    player: ProfessionalPlayer | NFLPlayer | NBAPlayer;
    existingOffer?: FreeAgencyOffer | PHLWaiverOffer | undefined;
    league: League;
    isOpen: boolean;
    onClose: () => void;
}

export const OfferModal: FC<OfferModalProps> = ({
     isOpen,
     onClose, 
     action, 
     player, 
     league, 
     existingOffer
    }) => {
    const [offer, setOffer] = useState(() => {
        if (existingOffer) {
            return existingOffer
        }
        return {};
    });
    const playerLabel = `${player.Age} year, ${player.Position} ${player.FirstName} ${player.LastName}`;
    let title = '';
    if (action === FreeAgentOffer) {
        title = `Offer ${playerLabel}`;
    } else if (action === WaiverOffer) {
        title = `Pick Up ${playerLabel}`;
    }

    return <>
        <Modal 
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        actions={<></>}
        maxWidth="max-w-[50vw]"
        >
            <div className="grid grid-cols-6 space-x-2">
                <div className="flex">
                    <Text variant="h6">
                        TEST
                    </Text>
                </div>
                <div className="flex">
                    <Text variant="h6">
                        TEST
                    </Text>
                </div>
                <div className="flex">
                    <Text variant="h6">
                        TEST
                    </Text>
                </div>
                <div className="flex">
                    <Text variant="h6">
                        TEST
                    </Text>
                </div>
                <div className="flex">
                    <Text variant="h6">
                        TEST
                    </Text>
                </div>
                <div className="flex">
                    <Text variant="h6">
                        TEST
                    </Text>
                </div>
            </div>
        </Modal>
    </>;
}