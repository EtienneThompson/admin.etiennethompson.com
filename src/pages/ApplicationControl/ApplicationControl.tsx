import { EmptyState } from "../../components/common/EmptyState";
import { ToolIcon } from "../../components/common/Icons";
import { PageHeader } from "../../components/common/PageHeader";
import { Panel } from "../../components/common/Panel";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

export const ApplicationControl = () => {
  useDocumentTitle("Application control");

  return (
    <>
      <PageHeader
        eyebrow="Applications"
        title="Application control"
        description="Monitor and manage the status of each application."
      />
      <Panel>
        <EmptyState
          icon={<ToolIcon />}
          title="Coming soon"
          description="Application controls haven't been built yet. Check back later."
        />
      </Panel>
    </>
  );
};
