"""Ежедневная перенумерация позиций.

Перемещения ставят элемент в середину между соседями, и промежутки между позициями со временем сужаются.
Раз в сутки (POSITIONS_REBALANCE_AT, UTC) позиции во всех списках выравниваются в 1, 2, 3…

Запуск: python -m app.jobs.rebalance_positions [--once]
"""

import argparse
import asyncio
import logging
from datetime import UTC, datetime, timedelta

from app.core.config import settings
from app.db.database import SessionFactory
from app.services import ordering
from app.services.board_service import BOARD_ORDER
from app.services.column_service import COLUMN_ORDER
from app.services.subtask_service import SUBTASK_ORDER
from app.services.task_service import TASK_ORDER

logger = logging.getLogger(__name__)

ORDERED_ENTITIES = (BOARD_ORDER, COLUMN_ORDER, TASK_ORDER, SUBTASK_ORDER)


async def rebalance_all() -> None:
    for spec in ORDERED_ENTITIES:
        async with SessionFactory() as session, session.begin():
            changed = await ordering.rebalance(session, spec)
        logger.info("%s: перенумеровано позиций: %d", spec.entity, changed)


def seconds_until_next_run(now: datetime) -> float:
    run_at = now.replace(
        hour=settings.POSITIONS_REBALANCE_AT.hour,
        minute=settings.POSITIONS_REBALANCE_AT.minute,
        second=0,
        microsecond=0,
    )
    if run_at <= now:
        run_at += timedelta(days=1)
    return (run_at - now).total_seconds()


async def run_daily() -> None:
    while True:
        delay = seconds_until_next_run(datetime.now(UTC))
        logger.info("Следующая перенумерация через %.0f с", delay)
        await asyncio.sleep(delay)
        try:
            await rebalance_all()
        except Exception:
            logger.exception("Перенумерация позиций не удалась, повтор в следующий запуск")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--once", action="store_true", help="перенумеровать сейчас и завершиться")
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    asyncio.run(rebalance_all() if args.once else run_daily())


if __name__ == "__main__":
    main()
