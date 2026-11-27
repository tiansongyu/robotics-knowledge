#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>

struct slot {
    uint32_t request_id;
    bool pending;
};

static void submit(struct slot *slot, uint32_t request_id)
{
    slot->request_id = request_id;
    slot->pending = true;
}

static bool complete(struct slot *slot, uint32_t echoed_id)
{
    if (!slot->pending || slot->request_id != echoed_id)
        return false;

    slot->pending = false;
    return true;
}

static int check(const char *name, bool actual, bool expected)
{
    if (actual == expected) {
        printf("ok - %s\n", name);
        return 0;
    }
    fprintf(stderr, "FAIL - %s (expected %d, got %d)\n", name, expected, actual);
    return 1;
}

int main(void)
{
    struct slot slot = {0};
    int failures = 0;

    submit(&slot, 17);
    slot.pending = false;  /* Software times out A. No DMA exists in this model. */
    submit(&slot, 18);

    failures += check("reject late A", complete(&slot, 17), false);
    failures += check("B remains pending", slot.pending, true);
    failures += check("accept matching B", complete(&slot, 18), true);
    failures += check("reject duplicate B", complete(&slot, 18), false);

    if (failures != 0)
        return 1;
    puts("PASS: 4 checks");
    return 0;
}
