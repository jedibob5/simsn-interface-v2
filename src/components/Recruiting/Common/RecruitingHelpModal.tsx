import { FC, useMemo } from "react";
import {
  Help1,
  League,
  ModalAction,
  SimCHL,
} from "../../../_constants/constants";
import { Modal } from "../../../_design/Modal";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { Text } from "../../../_design/Typography";
import { usePagination } from "../../../_hooks/usePagination";
import { CHLRecrutingHelpContent } from "../CHLRecruiting/CHLHelpContent";

interface RecruitingHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League;
  modalAction: ModalAction;
}

export const RecruitingHelpModal: FC<RecruitingHelpModalProps> = ({
  isOpen,
  onClose,
  league,
  modalAction,
}) => {
  const helpContent = useMemo(() => {
    if (league === SimCHL) {
      return CHLRecrutingHelpContent;
    }
    return [];
  }, [league]);
  const { currentPage, totalPages, goToNextPage, goToPreviousPage } =
    usePagination(helpContent.length, 1);

  const contentForPage = helpContent[currentPage];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Recruiting Help"
        actions={
          <>
            <ButtonGroup classes="mr-[8rem]">
              <Button onClick={goToPreviousPage} disabled={currentPage === 0}>
                Prev
              </Button>{" "}
              <Text variant="body-small" className="flex items-center">
                {currentPage + 1}
              </Text>
              <Button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button size="sm" variant="primary" onClick={onClose}>
                <Text variant="small">Close</Text>
              </Button>
            </ButtonGroup>
          </>
        }
      >
        {modalAction === Help1 && (
          <>
            {contentForPage.map((line, index) => (
              <Text
                key={index}
                variant={index === 0 ? "h6" : "body-small"}
                classes="mb-2 text-start"
              >
                {line}
              </Text>
            ))}
          </>
        )}
      </Modal>
    </>
  );
};
